-- Custom SQL migration file, put your code below! --
INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Usuarios', 'user-cog', '/usuarios');--> statement-breakpoint
INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Zonas', 'map-2', '/zonas');--> statement-breakpoint
INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Clientes', 'users-group', '/clientes');--> statement-breakpoint
INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Servicios', 'network', '/servicios');--> statement-breakpoint
INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Pagos', 'credit-card-pay', '/pagos');--> statement-breakpoint
INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Deudas', 'tax', '/deudas');--> statement-breakpoint
INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Cobranzas', 'chart-line', '/cobranzas');--> statement-breakpoint

INSERT INTO `permiso`(`nombre`, `usuario_creacion`) VALUES ('Administrador', 1);--> statement-breakpoint
INSERT INTO `permiso`(`nombre`, `usuario_creacion`) VALUES ('Asistente', 1);--> statement-breakpoint

INSERT INTO `permiso_modulo`(`id_permiso`, `id_modulo`) VALUES (
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Administrador'), -- Obtenemos El Id Del Permiso Cuyo Nombre Es Administrador
  (SELECT `id` FROM `modulo` WHERE `url` = '/usuarios') -- Obtenemos El Id Del Módulo cuya ruta es /usuarios
);--> statement-breakpoint

INSERT INTO `permiso_modulo`(`id_permiso`, `id_modulo`) VALUES (
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Administrador'),
  (SELECT `id` FROM `modulo` WHERE `url` = '/zonas')
);--> statement-breakpoint

INSERT INTO `permiso_modulo`(`id_permiso`, `id_modulo`) VALUES (
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Administrador'),
  (SELECT `id` FROM `modulo` WHERE `url` = '/clientes')
);--> statement-breakpoint

INSERT INTO `permiso_modulo`(`id_permiso`, `id_modulo`) VALUES (
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Administrador'),
  (SELECT `id` FROM `modulo` WHERE `url` = '/servicios')
);--> statement-breakpoint

INSERT INTO `permiso_modulo`(`id_permiso`, `id_modulo`) VALUES (
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Administrador'),
  (SELECT `id` FROM `modulo` WHERE `url` = '/pagos')
);--> statement-breakpoint

INSERT INTO `permiso_modulo`(`id_permiso`, `id_modulo`) VALUES (
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Administrador'),
  (SELECT `id` FROM `modulo` WHERE `url` = '/cobranzas')
);--> statement-breakpoint

INSERT INTO `permiso_modulo`(`id_permiso`, `id_modulo`) VALUES (
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Asistente'),
  (SELECT `id` FROM `modulo` WHERE `url` = '/clientes')
);--> statement-breakpoint

INSERT INTO `usuario`(`username`, `password`, `nombres`, `apellidos`, `email`, `id_permiso`, `usuario_creacion`) VALUES (
  'admin', '$2b$10$27vcyjpS1hFfG.i72ekpkel6.mfJwOqafkiUYyKKTjLbnyETmK0/W', 'Jhonatan', 'Panta', 'admin@admin.com',
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Administrador'), 1
);