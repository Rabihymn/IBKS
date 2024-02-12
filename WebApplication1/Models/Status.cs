using System.ComponentModel.DataAnnotations.Schema;

namespace client_site.Models
{
    [Table("Status", Schema = "Support")]
    public class Status
    {
        public int Id { get; set; }
        public string Title { get; set; }

    }
}