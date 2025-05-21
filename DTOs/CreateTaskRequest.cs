namespace TodoApi.DTOs
{
    public class CreateTaskRequest
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; } = false;
    }
}