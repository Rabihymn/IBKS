using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class User1
{
    public string Oid { get; set; } = null!;

    public string? DisplayName { get; set; }

    public string? Email { get; set; }

    public string? FullName { get; set; }

    public DateTime? LastScannedUtc { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
