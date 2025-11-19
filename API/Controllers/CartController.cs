using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using API.DTOs;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly DataContext _context;

        public CartController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var cart = await GetOrCreate();
            if(cart == null)
            {
                return NotFound();
            }
            return CartToDto(cart);
        }
        [HttpPost("add-item")]
        public async Task<ActionResult> AddItem(int productId, int quantity)
        {
            var cart = await GetOrCreate();
            var product = await _context.Products.FirstOrDefaultAsync(x=>x.Id == productId);

            if(product == null)
            {
                return NotFound("There is no product.");
            }

            cart.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                return CreatedAtAction(nameof(GetCart),CartToDto(cart));
            }

            return BadRequest(new ProblemDetails{Title = "the product cant be added."});
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteItem(int productId, int quantity)
        {
            var cart = await GetOrCreate();
            var product = await _context.Products.FirstOrDefaultAsync(x=>x.Id == productId);

            if(product == null)
            {
                return NotFound("There is no product");
            }

            cart.DeleteItem(product,quantity);

            var number = await _context.SaveChangesAsync() ;
            var result = number > 0;

            if (result)
            {
                return NoContent();
            }
            return BadRequest(new ProblemDetails{Title = "the product can not be deleted"});
        }

        private async Task<Cart> GetOrCreate()
        {
            var cart = await _context.Carts.Include(i=>i.Items)
                                    .ThenInclude(p=>p.Product)
                                    .Where(i=>i.CustomerId == Request.Cookies["customerId"])
                                    .FirstOrDefaultAsync();

            if(cart == null)
            {
                var customerId = Guid.NewGuid().ToString();

                var cookieOptions = new CookieOptions()
                {
                    Expires = DateTime.Now.AddMonths(1),
                    IsEssential = true
                };

                Response.Cookies.Append("customerId",customerId, cookieOptions);

                var newCart = new Cart
                {
                    CustomerId = customerId
                };

                _context.Carts.Add(newCart);
                await _context.SaveChangesAsync();

                return newCart;
            }

            return cart;
        }
        private CartDto CartToDto(Cart cart)
        {
            return new CartDto
            {
                Id = cart.Id,
                CustomerId = cart.CustomerId,
                Items = cart.Items.Select(x=> new CartItemDto
                {
                    ProductId = x.Product.Id,
                    Name = x.Product.Name,
                    Price = x.Product.Price,
                    Quantity = x.Quantity,
                    ImgUrl = x.Product.ImageUrl
                }).ToList<CartItemDto>()
            };
        }
    }
}
