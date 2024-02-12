﻿using System;
using System.Collections.Generic;

namespace BackEnd.Models;

public partial class Status
{
    public int Id { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
