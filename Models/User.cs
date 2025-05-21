using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        // Навигационное свойство
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}