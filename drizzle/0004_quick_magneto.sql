ALTER TABLE `servicio` MODIFY COLUMN `ultimo_pago` date;--> statement-breakpoint
ALTER TABLE `servicio` MODIFY COLUMN `estado_deuda` char(2) NOT NULL DEFAULT 'PE';