CREATE TABLE `cliente` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ip` varchar(100) NOT NULL,
	`nombres` varchar(100) NOT NULL,
	`apellidos` varchar(100) NOT NULL,
	`numero_dni` varchar(8) NOT NULL,
	`numero_telefono` varchar(50),
	`direccion` varchar(250) NOT NULL,
	`departamento` varchar(150) NOT NULL,
	`provincia` varchar(150) NOT NULL,
	`distrito` varchar(150) NOT NULL,
	`referencia` varchar(250) NOT NULL,
	`coordenadas` varchar(250) NOT NULL,
	`fachada` varchar(250) NOT NULL,
	`id_zona` int NOT NULL,
	`estado` char(1) NOT NULL DEFAULT 'A',
	`fecha_creacion` datetime NOT NULL DEFAULT now(),
	`usuario_creacion` int NOT NULL,
	`fecha_modificacion` datetime,
	`usuario_modificacion` int,
	CONSTRAINT `cliente_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comprobante` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_pago` int NOT NULL,
	`numero_identificacion` varchar(20) NOT NULL,
	`igv` varchar(10) NOT NULL,
	`tipo_comprobante` varchar(10) NOT NULL,
	`fecha_emision` varchar(30) NOT NULL,
	`estado` char(1) NOT NULL DEFAULT 'A',
	`fecha_creacion` datetime NOT NULL DEFAULT now(),
	`usuario_creacion` int NOT NULL,
	`fecha_modificacion` datetime,
	`usuario_modificacion` int,
	CONSTRAINT `comprobante_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deuda` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fecha_creacion` datetime NOT NULL DEFAULT now(),
	`fecha_limite` varchar(100) NOT NULL,
	`fecha_notificacion` varchar(10) NOT NULL,
	`monto` varchar(10) NOT NULL,
	`ultimo_pago` varchar(10) NOT NULL,
	`id_servicio` int NOT NULL,
	`estado` char(1) NOT NULL DEFAULT 'A',
	`usuario_creacion` int NOT NULL,
	`fecha_modificacion` datetime,
	`usuario_modificacion` int,
	CONSTRAINT `deuda_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pago` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fecha_pago` varchar(100) NOT NULL,
	`monto` varchar(100) NOT NULL,
	`forma_pago` varchar(10) NOT NULL,
	`id_servicio` int NOT NULL,
	`id_deuda` int NOT NULL,
	`estado` char(1) NOT NULL DEFAULT 'A',
	`fecha_creacion` datetime NOT NULL DEFAULT now(),
	`usuario_creacion` int NOT NULL,
	`fecha_modificacion` datetime,
	`usuario_modificacion` int,
	CONSTRAINT `pago_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modulo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`icono` varchar(20) NOT NULL,
	`url` varchar(200) NOT NULL,
	CONSTRAINT `modulo_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permiso_modulo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_permiso` int NOT NULL,
	`id_modulo` int NOT NULL,
	CONSTRAINT `permiso_modulo_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permiso` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`estado` char(1) NOT NULL DEFAULT 'A',
	`fecha_creacion` datetime NOT NULL DEFAULT now(),
	`usuario_creacion` int NOT NULL,
	`fecha_modificacion` datetime,
	`usuario_modificacion` int,
	CONSTRAINT `permiso_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `servicio` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(50) NOT NULL,
	`fecha_inicio` varchar(100) NOT NULL,
	`fecha_fin` varchar(100) NOT NULL,
	`unidad` varchar(10) NOT NULL,
	`precio_unidad` varchar(100) NOT NULL,
	`ultimo_pago` varchar(100) NOT NULL,
	`ultimo_deuda` varchar(100) NOT NULL,
	`estado_deuda` varchar(100) NOT NULL,
	`id_cliente` int NOT NULL,
	`id_tiposervicio` int NOT NULL,
	`estado` char(1) NOT NULL DEFAULT 'A',
	`fecha_creacion` datetime NOT NULL DEFAULT now(),
	`usuario_creacion` int NOT NULL,
	`fecha_modificacion` datetime,
	`usuario_modificacion` int,
	CONSTRAINT `servicio_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tiposervicio` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(50) NOT NULL,
	`frecuencia` varchar(150) NOT NULL,
	`precio_unitario` varchar(100) NOT NULL,
	`id_cliente` int NOT NULL,
	`estado` char(1) NOT NULL DEFAULT 'A',
	`fecha_creacion` datetime NOT NULL DEFAULT now(),
	`usuario_creacion` int NOT NULL,
	`fecha_modificacion` datetime,
	`usuario_modificacion` int,
	CONSTRAINT `tiposervicio_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sesion` (
	`id` varchar(255) NOT NULL,
	`expiracion` datetime NOT NULL,
	`id_usuario` int NOT NULL,
	CONSTRAINT `sesion_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usuario` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(50) NOT NULL,
	`password` varchar(100) NOT NULL,
	`nombres` varchar(100) NOT NULL,
	`apellidos` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`numero_telefono` varchar(50),
	`id_permiso` int NOT NULL,
	`estado` char(1) NOT NULL DEFAULT 'A',
	`fecha_creacion` datetime NOT NULL DEFAULT now(),
	`usuario_creacion` int NOT NULL,
	`fecha_modificacion` datetime,
	`usuario_modificacion` int,
	CONSTRAINT `usuario_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `usuario_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `zona` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(250) NOT NULL,
	`estado` char(1) NOT NULL DEFAULT 'A',
	`fecha_creacion` datetime NOT NULL DEFAULT now(),
	`usuario_creacion` int NOT NULL,
	`fecha_modificacion` datetime,
	`usuario_modificacion` int,
	CONSTRAINT `zona_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `cliente` ADD CONSTRAINT `cliente_id_zona_fk` FOREIGN KEY (`id_zona`) REFERENCES `zona`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comprobante` ADD CONSTRAINT `comprobante_id_pago_fk` FOREIGN KEY (`id_pago`) REFERENCES `pago`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deuda` ADD CONSTRAINT `deuda_id_servicio_fk` FOREIGN KEY (`id_servicio`) REFERENCES `servicio`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pago` ADD CONSTRAINT `pago_id_servicio_fk` FOREIGN KEY (`id_servicio`) REFERENCES `servicio`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pago` ADD CONSTRAINT `pago_id_deuda_fk` FOREIGN KEY (`id_deuda`) REFERENCES `deuda`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `permiso_modulo` ADD CONSTRAINT `permiso_modulo_id_permiso_fk` FOREIGN KEY (`id_permiso`) REFERENCES `permiso`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `permiso_modulo` ADD CONSTRAINT `permiso_modulo_id_modulo_fk` FOREIGN KEY (`id_modulo`) REFERENCES `modulo`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `servicio` ADD CONSTRAINT `servicio_id_cliente_fk` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `servicio` ADD CONSTRAINT `servicio_id_tiposervicio_fk` FOREIGN KEY (`id_tiposervicio`) REFERENCES `tiposervicio`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tiposervicio` ADD CONSTRAINT `tiposervicio_id_cliente_fk` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sesion` ADD CONSTRAINT `sesion_id_usuairo_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_id_permiso_fk` FOREIGN KEY (`id_permiso`) REFERENCES `permiso`(`id`) ON DELETE no action ON UPDATE no action;