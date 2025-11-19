using System;

namespace API.DTOs;

public class CartItemDto
{
    public string? Name { get; set; }
    public decimal Price { get; set; }
    public string? ImgUrl {get; set;}
    public int Quantity { get; set; }
    public int ProductId { get; set; }
}
