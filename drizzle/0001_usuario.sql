-- Custom SQL migration file, put your code below! --


INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Usuarios', 'users', '/usuarios');--> statement-breakpoint
INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Clientes', 'people', '/clientes');--> statement-breakpoint
INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Servicios', 'people', '/servicios');--> statement-breakpoint
INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Pagos', 'people', '/pagos');
INSERT INTO `modulo`(`nombre`, `icono`, `url`) VALUES ('Deudas', 'people', '/deudas');



INSERT INTO `permiso`(`nombre`, `usuario_creacion`) VALUES ('Administrador', 1);--> statement-breakpoint
INSERT INTO `permiso`(`nombre`, `usuario_creacion`) VALUES ('Asistente', 1);--> statement-breakpoint

INSERT INTO `permiso_modulo`(`id_permiso`, `id_modulo`) VALUES (
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Administrador'), -- Obtenemos El Id Del Permiso Cuyo Nombre Es Administrador
  (SELECT `id` FROM `modulo` WHERE `url` = '/usuarios') -- Obtenemos El Id Del Módulo cuya ruta es /usuarios
);--> statement-breakpoint

INSERT INTO `permiso_modulo`(`id_permiso`, `id_modulo`) VALUES (
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Administrador'),
  (SELECT `id` FROM `modulo` WHERE `url` = '/clientes')
);--> statement-breakpoint

INSERT INTO `permiso_modulo`(`id_permiso`, `id_modulo`) VALUES (
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Asistente'),
  (SELECT `id` FROM `modulo` WHERE `url` = '/clientes')
);--> statement-breakpoint

INSERT INTO `usuario`(`username`, `password`, `nombres`, `apellidos`, `email`, `id_permiso`, `usuario_creacion`) VALUES (
  'admin', '$2b$10$27vcyjpS1hFfG.i72ekpkel6.mfJwOqafkiUYyKKTjLbnyETmK0/W', 'Jhonatan', 'Panta', 
  (SELECT `id` FROM `permiso` WHERE `nombre` = 'Administrador'), 1
);