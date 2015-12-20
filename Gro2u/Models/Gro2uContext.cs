using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace Gro2u.Models
{
    public class Gro2uContext : DbContext
    {  
        public Gro2uContext() : base("name=Gro2uContext")
        {
            this.Database.Log = s => Debug.WriteLine(s);
        }

        public DbSet<Product> Products { get; set; }
    }
}
