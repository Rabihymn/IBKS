
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models;

public partial class Ticket
{
    public long Id { get; set; }

    public string? Title { get; set; }

    public int ApplicationId { get; set; }

    public string? ApplicationName { get; set; }

    public string? Description { get; set; }

    public string? Url { get; set; }

    public string? StackTrace { get; set; }

    public string? Device { get; set; }

    public string? Browser { get; set; }

    public string? Resolution { get; set; }

    public int PriorityId { get; set; }

    public int StatusId { get; set; }

    public int? UserId { get; set; }

    public string? UserOid { get; set; }

    public int InstalledEnvironmentId { get; set; }

    public int TicketTypeId { get; set; }

    public DateTime Date { get; set; }

    public bool? Deleted { get; set; }

    public DateTime LastModified { get; set; }

    public string? CreatedByOid { get; set; }

    public virtual InstalledEnvironment InstalledEnvironment { get; set; } = null!;

    [ForeignKey("PriorityId")]
    public virtual Priority PriorityIdById { get; set; } = null!;

    public virtual Status Status { get; set; } = null!;

    public virtual ICollection<TicketEventLog> TicketEventLogs { get; set; } = new List<TicketEventLog>();

    public virtual TicketType TicketType { get; set; } = null!;

    public virtual User1? UserO { get; set; }
}
