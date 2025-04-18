ALTER TABLE `servicio` MODIFY COLUMN `fecha_inicio` date NOT NULL;--> statement-breakpoint
ALTER TABLE `servicio` MODIFY COLUMN `fecha_fin` date;--> statement-breakpoint
ALTER TABLE `servicio` MODIFY COLUMN `unidad` int NOT NULL;--> statement-breakpoint
ALTER TABLE `servicio` MODIFY COLUMN `precio_unidad` decimal NOT NULL;--> statement-breakpoint
ALTER TABLE `servicio` MODIFY COLUMN `ultimo_pago` date NOT NULL;--> statement-breakpoint
ALTER TABLE `servicio` MODIFY COLUMN `ultima_deuda` date;--> statement-breakpoint
ALTER TABLE `servicio` MODIFY COLUMN `estado_deuda` char(2);--> statement-breakpoint
ALTER TABLE `servicio` DROP COLUMN `nombre`;