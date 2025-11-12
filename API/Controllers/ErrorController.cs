using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorController : ControllerBase
    {
        [HttpGet("not-found")]
        public IActionResult NotFoundError()
        {
            return NotFound(new { Message = "The requested resource was not found." }); // 404
        }

        [HttpGet("bad-request")]
        public IActionResult BadRequestError()
        {
            return BadRequest(new { Message = "The request was invalid." }); // 400
        }

        [HttpGet("unauthorized")]
        public IActionResult UnauthorizedError()
        {
            return Unauthorized(new { Message = "You are not authorized to access this resource." }); // 401
        }
        [HttpGet("server-error")]
        public IActionResult ServerError()
        {
            throw new Exception("Server error occurred."); // 500
        }

        [HttpGet("validation-error")]
        public IActionResult ValidationError()
        {
            ModelState.AddModelError("Field1", "Field1 is required.");
            ModelState.AddModelError("Field2", "Field2 must be a valid email address.");
            return ValidationProblem(ModelState); // 400 with validation details
        }
    }
}
