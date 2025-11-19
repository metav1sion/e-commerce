using System;

namespace API.Entities;

public class Cart
{
    public int Id { get; set; }
    public string CustomerId { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<CartItem> Items { get; set; } = new List<CartItem>(); // bire çok ilişki
    public void AddItem(Product product, int quantity)
    {
        var item = Items.Where(c=>c.ProductId == product.Id).FirstOrDefault();
        if(item == null)
        {
            Items.Add(new CartItem
            {
                Product = product,
                Quantity = quantity
            });
        }
        else
        {
            item.Quantity += quantity;
        }
    }

    public void DeleteItem(Product product, int quantity)
    {
        var item = Items.Where(c=>c.ProductId == product.Id).FirstOrDefault();
        if(item == null) return;
        item.Quantity -= quantity;

        if(item.Quantity <= 0)
        {
            Items.Remove(item);
        }
    }
}

public class CartItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public int ProductId { get; set; }
    public int CartId { get; set; }
    public Product Product { get; set; } = null!; // Navigation property // bire bir ilişki
    //public Cart Cart { get; set; } = null!; // Navigation property // bire bir ilişki
}
