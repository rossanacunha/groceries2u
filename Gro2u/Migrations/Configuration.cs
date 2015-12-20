namespace Gro2u.Migrations
{
    using Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Gro2u.Models.Gro2uContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Gro2uContext context)
        {
            context.Products.AddOrUpdate(x => x.Id,
            new Product() { Id = 1, Name = "Chocolate" },
            new Product() { Id = 2, Name = "Strawberry" });
        }
    }
}
