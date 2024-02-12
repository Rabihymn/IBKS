using System.ComponentModel.DataAnnotations.Schema;

namespace client_site.Models
{
    [Table("Priority", Schema = "Support")]
    public class Priority
    {
        public int Id { get; set; }
        public string Title { get; set; }

    }
}