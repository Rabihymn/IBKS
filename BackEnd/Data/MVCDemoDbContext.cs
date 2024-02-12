using client_site.Models;
using Microsoft.EntityFrameworkCore;

public class MVCDemoDbContext : DbContext

{
    public MVCDemoDbContext(DbContextOptions<MVCDemoDbContext> options) : base(options)
    {
    }
    // create a model for users 
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<TicketType> TicketTypes { get; set; }
    public DbSet<Priority> Priorities { get; set; }
    public DbSet<TicketReply> TicketReplies { get; set; }

    // protected override void OnModelCreating(ModelBuilder modelBuilder)
    // {
    //     modelBuilder.Entity<TicketReply>()
    //   .Property(tr => tr.Tid)
    //   .HasColumnName("Tid");

    //     base.OnModelCreating(modelBuilder);
    // }

}