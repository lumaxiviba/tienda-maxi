const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Tienda",
      version: "1.0.0",
      description: "Documentación de la API con Swagger",
    },
    // Usar rutas relativas evita que librerías intenten parsear una URL completa
    // que puede contener ':' y romper path-to-regexp. Documentamos la base API
    // como '/api' y el frontend puede apuntar a la URL pública.
    servers: [
      {
        url: '/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Documentación Swagger disponible en /api-docs");
}

module.exports = { swaggerDocs };
