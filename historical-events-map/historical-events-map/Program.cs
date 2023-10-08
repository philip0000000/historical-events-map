using Microsoft.EntityFrameworkCore;
using HistoricalEventsMap.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Register DbContext
string connectionString = builder.Configuration["DATABASE_CONNECTION_STRING"];

builder.Services.AddDbContext<MapDbContext>(options =>
    options.UseSqlServer(connectionString));

// Add HSTS options
builder.Services.AddHsts(options =>
{
    options.MaxAge = TimeSpan.FromDays(365);
    options.IncludeSubDomains = true;  // Include subdomains in HSTS policy
    // If you're sure about preloading:
    // options.Preload = true;
});

// CORS setup
var environment = builder.Environment;

builder.Services.AddCors(options =>
{
    if (environment.IsDevelopment())
    {
        // The specific CORS configuration provided is primarily suited for a development environment.
        // In a production environment, you should be more restrictive with CORS settings for security reasons.
        options.AddPolicy("AllowReactApp",
            builder => builder.WithOrigins("http://localhost:3000")
                              .AllowAnyMethod()
                              .AllowAnyHeader());
    }
    else
    {
        // For production environment
        options.AddPolicy("AllowReactApp",
            builder => builder.WithOrigins("https://historical-events-map.azurewebsites.net")
                              .WithMethods("GET")
                              .WithHeaders("Authorization", "Content-Type"));
    }
});

// App build
var app = builder.Build();

// Configure the HTTP request pipeline.
// HSTS and HTTPS redirection
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors("AllowReactApp");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
