# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# Копіюємо проект і відновлюємо залежності
COPY ["WebAPIATB/WebAPIATB.csproj", "WebAPIATB/"]
RUN dotnet restore "WebAPIATB/WebAPIATB.csproj"

# Копіюємо всі файли і будуємо додаток
COPY . .
WORKDIR /source/WebAPIATB
RUN dotnet publish -c Release -o /app

# Stage 2: Final image for runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0

# Встановлюємо необхідні пакети для підключення до PostgreSQL
WORKDIR /app

# Копіюємо додаток з етапу побудови
COPY --from=build /app .

# Запускаємо додаток
ENTRYPOINT ["dotnet", "WebAPIATB.dll"]
