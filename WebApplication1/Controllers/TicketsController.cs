using client_site.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly MVCDemoDbContext _context;

    public TicketsController(MVCDemoDbContext context, ILogger<TicketsController> logger)
    {
        _context = context;
    }
    // to get the tickets 
    // get api/tickets
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets(int pageNumber = 1, int pageSize = 10)
    {
        int skipCount = (pageNumber - 1) * pageSize;
        var totalCount = await _context.Tickets.CountAsync();

        var tickets = await _context.Tickets
            .Include(t => t.TicketTypeById) // Include the related TicketType data
            .Include(t => t.StatusById) //  Include the related Status data
            .Include(t => t.PriorityIdById) // Include the related priority data
            .OrderByDescending(t => t.Date)
            .Skip(skipCount) // Skip the specified number of items
            .Take(pageSize)
            .Select(t => new Ticket // Project to a new Ticket object with Title instead of TicketTypeId
            {
                Id = t.Id,
                Title = t.Title,
                ApplicationName = t.ApplicationName,
                TicketTypeById = new TicketType { Id = t.TicketTypeById.Id, Title = t.TicketTypeById.Title },
                StatusById = new Status { Id = t.StatusById.Id, Title = t.StatusById.Title },
                PriorityIdById = new Priority { Id = t.PriorityIdById.Id, Title = t.PriorityIdById.Title }
            })
            .ToListAsync();

        return Ok(new { tickets, totalCount });
    }

    public List<TicketReply> GetRepliesForTicket(int ticketId)
    {
        // Perform a manual join between Tickets and Replies based on ticketId
        var repliesForTicket = (from reply in _context.TicketReplies
                                where reply.TicketId == ticketId
                                select reply).ToList();
        return repliesForTicket;
    }
    public class TicketWithReplies
    {
        public required Ticket Ticket { get; set; }  // Represents the ticket object
        public required List<TicketReply> Replies { get; set; } // Represents the list of associated replies
    }

    // get the ticket with id and replies 
    // get api/tickets/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Ticket>> GetTicketById(int id)
    {

        var ticket = await _context.Tickets
            .Include(t => t.TicketTypeById) // Include the related TicketType data
            .Include(t => t.StatusById) // Include the related Status data
            .Include(t => t.PriorityIdById) // Include the related priority data
            .FirstOrDefaultAsync(t => t.Id == id);

        var replies = await _context.TicketReplies.Where(t => t.TicketId == id).ToListAsync();


        if (ticket == null)
        {
            return NotFound(); // Return 404 Not Found if the ticket with the specified ID is not found
        }

        // Project to a new Ticket object with Title instead of TicketTypeId
        var ticketDto = new Ticket
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            ApplicationName = ticket.ApplicationName,
            PriorityId = ticket.PriorityId,
            StatusId = ticket.StatusId,
            TicketTypeById = new TicketType { Id = ticket.TicketTypeById.Id, Title = ticket.TicketTypeById.Title },
            StatusById = new Status { Id = ticket.StatusById.Id, Title = ticket.StatusById.Title },
            PriorityIdById = new Priority { Id = ticket.PriorityIdById.Id, Title = ticket.PriorityIdById.Title },
            TicketReplies = replies

        };

        return Ok(ticketDto);
    }

    public class TicketUpdateDto
    {
        public string? Title { get; set; }
        public string? ApplicationName { get; set; }
        public string? Reply { get; set; }
        public int? PriorityId { get; set; }
        public int? statusId { get; set; }
        public int? TicketTypeId { get; set; }

    }

    public class TicketInsertDto
    {
        public required string Title { get; set; }
        public required string ApplicationName { get; set; }

        public required String Description { get; set; }
        public string? Reply { get; set; }
        public required int PriorityId { get; set; }
        public required int statusId { get; set; }
        public required int TicketTypeId { get; set; }

    }


    public class ReplyDto
    {
        public int TicketId { get; set; }
        public string Reply { get; set; }
        public DateTime date { get; set; }

    }

    // to update a ticket 
    // put api/tickets/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTicket(long id, TicketUpdateDto ticketUpdateDto)
    {


        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
        {
            return NotFound();
        }

        if (ticketUpdateDto.ApplicationName != null)
        {
            ticket.ApplicationName = ticketUpdateDto.ApplicationName;
        }

        if (ticketUpdateDto.PriorityId != null)
        {
            ticket.PriorityId = ticketUpdateDto.PriorityId.Value;
        }

        if (ticketUpdateDto.statusId != null)
        {
            ticket.StatusId = ticketUpdateDto.statusId.Value;
        }

        if (ticketUpdateDto.TicketTypeId != null)
        {
            ticket.TicketTypeId = ticketUpdateDto.TicketTypeId.Value;
        }

        if (ticketUpdateDto.Reply != null)
        {
            // Create a new TicketReply object

            var newReply = new TicketReply
            {
                TicketId = ticket.Id, // Assuming TId is the foreign key linking Ticket and TicketReply
                Reply = ticketUpdateDto.Reply,
                replyDate = DateTime.Now // Use the current date and time
            };

            // Add the new reply to the context
            _context.TicketReplies.Add(newReply);
        }


        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TicketExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }


    //  DELETE: api/Tickets/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTicket(long id)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
        {
            return NotFound();
        }

        _context.Tickets.Remove(ticket);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TicketExists(long id)
    {
        return _context.Tickets.Any(e => e.Id == id);
    }


    [HttpGet("priorities")]
    public async Task<ActionResult<IEnumerable<Priority>>> GetTicketPriority()
    {

        var priorities = await _context.Priorities.ToListAsync();

        return Ok(priorities);
    }

    // POST: api/Tickets to add ticket
    [HttpPost]
    public async Task<ActionResult<Ticket>> PostTicket(TicketInsertDto ticketDto)
    {

        var ticket = new Ticket
        {
            Date = DateTime.Now,
            LastModified = DateTime.Now,
            InstalledEnvironmentId = 1,
            Title = ticketDto.Title,
            Description = ticketDto.Description,
            ApplicationName = ticketDto.ApplicationName,
            PriorityId = ticketDto.PriorityId,
            StatusId = ticketDto.statusId,
            TicketTypeId = ticketDto.TicketTypeId
        };

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();
        var ticketReply = new TicketReply
        {
            TicketId = ticket.Id, // Assuming TId is the foreign key linking Ticket and TicketReply
            Reply = ticketDto.Reply,
            replyDate = DateTime.Now // Use the current date and time
        };

        _context.TicketReplies.Add(ticketReply);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetTicket", new { id = ticket.Id }, ticket);
    }

    // POST: api/replies to add ticket
    [HttpPost("reply")]
    public async Task<ActionResult<TicketReply>> ReplyOnTicket(TicketReply ticketReply)
    {
        if (ticketReply.TicketId > 0)
        {
            ticketReply.replyDate = DateTime.Now;
            Console.WriteLine("Received TicketReply:");
            Console.WriteLine($"ReplyId: {ticketReply.ReplyId}");
            Console.WriteLine($"Reply: {ticketReply.Reply}");
            Console.WriteLine($"ReplyDate: {ticketReply.replyDate}");
            _context.TicketReplies.Add(ticketReply);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetReply", new { ReplyId = ticketReply.ReplyId }, ticketReply);
        }
        else
        {
            return BadRequest("Invalid ticket ID");
        }
    }


    [HttpGet("types")]
    public async Task<ActionResult<IEnumerable<TicketType>>> GetTicketType()
    {

        var ticketTypes = await _context.TicketTypes.ToListAsync();

        return Ok(ticketTypes);
    }
}
