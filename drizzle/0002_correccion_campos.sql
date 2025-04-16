ALTER TABLE `cliente` RENAME COLUMN `numero_dni` TO `dni`;--> statement-breakpoint
ALTER TABLE `cliente` RENAME COLUMN `numero_telefono` TO `celular`;--> statement-breakpoint
ALTER TABLE `servicio` RENAME COLUMN `ultimo_deuda` TO `ultima_deuda`;--> statement-breakpoint
ALTER TABLE `servicio` RENAME COLUMN `id_tiposervicio` TO `id_tipo_servicio`;--> statement-breakpoint
ALTER TABLE `usuario` RENAME COLUMN `username` TO `login`;--> statement-breakpoint
ALTER TABLE `usuario` DROP INDEX `usuario_username_unique`;--> statement-breakpoint
ALTER TABLE `servicio` DROP FOREIGN KEY `servicio_id_tiposervicio_fk`;
--> statement-breakpoint
ALTER TABLE `cliente` MODIFY COLUMN `referencia` varchar(250);--> statement-breakpoint
ALTER TABLE `deuda` MODIFY COLUMN `fecha_limite` date NOT NULL;--> statement-breakpoint
ALTER TABLE `deuda` MODIFY COLUMN `fecha_notificacion` date NOT NULL;--> statement-breakpoint
ALTER TABLE `deuda` MODIFY COLUMN `monto` decimal NOT NULL;--> statement-breakpoint
ALTER TABLE `pago` MODIFY COLUMN `fecha_pago` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `pago` MODIFY COLUMN `monto` decimal NOT NULL;--> statement-breakpoint
ALTER TABLE `pago` MODIFY COLUMN `forma_pago` varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE `tiposervicio` MODIFY COLUMN `frecuencia` char(2) NOT NULL;--> statement-breakpoint
ALTER TABLE `tiposervicio` MODIFY COLUMN `precio_unitario` decimal NOT NULL;--> statement-breakpoint
ALTER TABLE `servicio` ADD `numero_ip` varchar(100);--> statement-breakpoint
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_login_unique` UNIQUE(`login`);--> statement-breakpoint
ALTER TABLE `servicio` ADD CONSTRAINT `servicio_id_tiposervicio_fk` FOREIGN KEY (`id_tipo_servicio`) REFERENCES `tiposervicio`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cliente` DROP COLUMN `ip`;