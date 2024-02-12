using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class User
{
    public Guid Id { get; set; }

    public string Oid { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public DateTime LastScanned { get; set; }
}
