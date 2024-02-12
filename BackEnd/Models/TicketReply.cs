using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace client_site.Models
{
    [Table("TicketReply", Schema = "Support")]
    public class TicketReply
    {
        [Column("TId")]
        [Required]
        public long TicketId { get; set; }

        [Key]
        public int ReplyId { get; set; }

        [Required]
        public string? Reply { get; set; }

        public DateTime replyDate { get; set; }

    }
}