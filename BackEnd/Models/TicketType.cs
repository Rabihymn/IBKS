using System.ComponentModel.DataAnnotations.Schema;

namespace client_site.Models
{
    [Table("TicketType", Schema = "Support")]
    public class TicketType
    {
        public int Id { get; set; }
        public string Title { get; set; }

    }
}