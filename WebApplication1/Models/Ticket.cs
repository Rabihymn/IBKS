using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace client_site.Models
{
    [Table("Ticket", Schema = "Support")]
    public class Ticket
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string ApplicationName { get; set; }

        [MaxLength]
        public string? Description { get; set; }

        public int ApplicationId { get; set; }
        public string? Url { get; set; }
        public string? StackTrace { get; set; }
        public string? Device { get; set; }
        public string? Browser { get; set; }
        public string? Resolution { get; set; }
        public int PriorityId { get; set; }
        public int StatusId { get; set; }
        public int? UserId { get; set; }
        public string? UserOID { get; set; }

        [ForeignKey("InstalledEnvironmentId")]
        public int? InstalledEnvironmentId { get; set; }
        public int TicketTypeId { get; set; }
        public DateTime? Date { get; set; }
        public bool? Deleted { get; set; }
        public DateTime? LastModified { get; set; }
        public string? CreatedByOID { get; set; }

        [ForeignKey("PriorityId")]
        public Priority? PriorityIdById { get; set; }

        [ForeignKey("TicketTypeId")]
        public TicketType? TicketTypeById { get; set; }

        [ForeignKey("StatusId")]
        public Status? StatusById { get; set; }

        // One-to-many relationship with TicketReply
        public List<TicketReply>? TicketReplies { get; set; }
    }
}