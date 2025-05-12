-- CreateTable
CREATE TABLE `Ciudad` (
    `id` VARCHAR(10) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pais` (
    `id` VARCHAR(2) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoIdentificacion` (
    `id` VARCHAR(2) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetodoPago` (
    `id` VARCHAR(2) NOT NULL,
    `descripcion` VARCHAR(120) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubtipoTrabajador` (
    `id` CHAR(4) NOT NULL,
    `descripcion` VARCHAR(45) NOT NULL,
    `tipoTrabajadorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoTrabajador` (
    `id` VARCHAR(2) NOT NULL,
    `descripcion` VARCHAR(120) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoContrato` (
    `id` CHAR(4) NOT NULL,
    `descripcion` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoIncapacidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConceptoNomina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(45) NOT NULL,
    `es_salarial` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empleador` (
    `identificacion` VARCHAR(10) NOT NULL,
    `digito_verificacion` CHAR(1) NULL,
    `nombre` VARCHAR(45) NOT NULL,
    `direccionId` INTEGER NOT NULL,
    `tipoIdentificacionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`identificacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Direccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `direccion` VARCHAR(100) NOT NULL,
    `ciudadId` VARCHAR(191) NOT NULL,
    `paisId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trabajador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `primer_apellido` VARCHAR(45) NOT NULL,
    `segundo_apellido` VARCHAR(45) NULL,
    `primer_nombre` VARCHAR(45) NOT NULL,
    `otros_nombres` VARCHAR(45) NULL,
    `tipoIdentificacionId` VARCHAR(191) NOT NULL,
    `identificacion` VARCHAR(10) NOT NULL,
    `direccionId` INTEGER NOT NULL,
    `datosPagoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DatoPago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `esta_activo` BOOLEAN NOT NULL,
    `metodoPagoId` VARCHAR(191) NOT NULL,
    `numero_cuenta` VARCHAR(45) NOT NULL,
    `entidad_bancaria` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InformacionContrato` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `riesgo_pension` INTEGER NOT NULL,
    `salario` DOUBLE NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NULL,
    `cargo` VARCHAR(45) NOT NULL,
    `tipoTrabajadorId` VARCHAR(191) NOT NULL,
    `subtipoTrabajadorId` VARCHAR(191) NOT NULL,
    `tipoContratoId` VARCHAR(191) NOT NULL,
    `direccionId` INTEGER NOT NULL,
    `trabajadorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PeriodoNomina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad_empleados` INTEGER NOT NULL,
    `total_devengado` DOUBLE NOT NULL,
    `total_deduccion` DOUBLE NOT NULL,
    `total_pago` DOUBLE NOT NULL,
    `fecha_liquidacion` DATETIME(3) NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiquidacionTrabajador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `periodoId` INTEGER NOT NULL,
    `consecutivo` INTEGER NOT NULL,
    `total_devengado` DOUBLE NOT NULL,
    `total_deduccion` DOUBLE NOT NULL,
    `total_pago` DOUBLE NOT NULL,
    `dias_laborados` INTEGER NOT NULL,
    `contratoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NovedadNomina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_novedad` DATETIME(3) NOT NULL,
    `cantidad_novedad` INTEGER NOT NULL,
    `valor_novedad` DOUBLE NOT NULL,
    `conceptoNominaId` INTEGER NOT NULL,
    `trabajadorId` INTEGER NOT NULL,
    `datoPagoId` INTEGER NOT NULL,
    `liquidacionTrabajadorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeduccionLiquidacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor_deduccion` DOUBLE NOT NULL,
    `novedadNominaId` INTEGER NOT NULL,
    `liquidacionTrabajadorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DevengadoLiquidacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor_devengado` DOUBLE NOT NULL,
    `novedadNominaId` INTEGER NOT NULL,
    `liquidacionTrabajadorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MvAusencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NOT NULL,
    `tipoIncapacidadId` INTEGER NOT NULL,
    `novedadNominaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MvHorasExtrasRecargo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hora_inicio` DATETIME(3) NOT NULL,
    `hora_fin` DATETIME(3) NOT NULL,
    `novedadNominaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubtipoTrabajador` ADD CONSTRAINT `SubtipoTrabajador_tipoTrabajadorId_fkey` FOREIGN KEY (`tipoTrabajadorId`) REFERENCES `TipoTrabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Empleador` ADD CONSTRAINT `Empleador_direccionId_fkey` FOREIGN KEY (`direccionId`) REFERENCES `Direccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Empleador` ADD CONSTRAINT `Empleador_tipoIdentificacionId_fkey` FOREIGN KEY (`tipoIdentificacionId`) REFERENCES `TipoIdentificacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Direccion` ADD CONSTRAINT `Direccion_ciudadId_fkey` FOREIGN KEY (`ciudadId`) REFERENCES `Ciudad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Direccion` ADD CONSTRAINT `Direccion_paisId_fkey` FOREIGN KEY (`paisId`) REFERENCES `Pais`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trabajador` ADD CONSTRAINT `Trabajador_tipoIdentificacionId_fkey` FOREIGN KEY (`tipoIdentificacionId`) REFERENCES `TipoIdentificacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trabajador` ADD CONSTRAINT `Trabajador_direccionId_fkey` FOREIGN KEY (`direccionId`) REFERENCES `Direccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trabajador` ADD CONSTRAINT `Trabajador_datosPagoId_fkey` FOREIGN KEY (`datosPagoId`) REFERENCES `DatoPago`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatoPago` ADD CONSTRAINT `DatoPago_metodoPagoId_fkey` FOREIGN KEY (`metodoPagoId`) REFERENCES `MetodoPago`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InformacionContrato` ADD CONSTRAINT `InformacionContrato_tipoTrabajadorId_fkey` FOREIGN KEY (`tipoTrabajadorId`) REFERENCES `TipoTrabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InformacionContrato` ADD CONSTRAINT `InformacionContrato_subtipoTrabajadorId_fkey` FOREIGN KEY (`subtipoTrabajadorId`) REFERENCES `SubtipoTrabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InformacionContrato` ADD CONSTRAINT `InformacionContrato_tipoContratoId_fkey` FOREIGN KEY (`tipoContratoId`) REFERENCES `TipoContrato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InformacionContrato` ADD CONSTRAINT `InformacionContrato_direccionId_fkey` FOREIGN KEY (`direccionId`) REFERENCES `Direccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InformacionContrato` ADD CONSTRAINT `InformacionContrato_trabajadorId_fkey` FOREIGN KEY (`trabajadorId`) REFERENCES `Trabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiquidacionTrabajador` ADD CONSTRAINT `LiquidacionTrabajador_periodoId_fkey` FOREIGN KEY (`periodoId`) REFERENCES `PeriodoNomina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiquidacionTrabajador` ADD CONSTRAINT `LiquidacionTrabajador_contratoId_fkey` FOREIGN KEY (`contratoId`) REFERENCES `InformacionContrato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NovedadNomina` ADD CONSTRAINT `NovedadNomina_conceptoNominaId_fkey` FOREIGN KEY (`conceptoNominaId`) REFERENCES `ConceptoNomina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NovedadNomina` ADD CONSTRAINT `NovedadNomina_trabajadorId_fkey` FOREIGN KEY (`trabajadorId`) REFERENCES `Trabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NovedadNomina` ADD CONSTRAINT `NovedadNomina_datoPagoId_fkey` FOREIGN KEY (`datoPagoId`) REFERENCES `DatoPago`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NovedadNomina` ADD CONSTRAINT `NovedadNomina_liquidacionTrabajadorId_fkey` FOREIGN KEY (`liquidacionTrabajadorId`) REFERENCES `LiquidacionTrabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeduccionLiquidacion` ADD CONSTRAINT `DeduccionLiquidacion_novedadNominaId_fkey` FOREIGN KEY (`novedadNominaId`) REFERENCES `NovedadNomina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeduccionLiquidacion` ADD CONSTRAINT `DeduccionLiquidacion_liquidacionTrabajadorId_fkey` FOREIGN KEY (`liquidacionTrabajadorId`) REFERENCES `LiquidacionTrabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DevengadoLiquidacion` ADD CONSTRAINT `DevengadoLiquidacion_novedadNominaId_fkey` FOREIGN KEY (`novedadNominaId`) REFERENCES `NovedadNomina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DevengadoLiquidacion` ADD CONSTRAINT `DevengadoLiquidacion_liquidacionTrabajadorId_fkey` FOREIGN KEY (`liquidacionTrabajadorId`) REFERENCES `LiquidacionTrabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MvAusencia` ADD CONSTRAINT `MvAusencia_tipoIncapacidadId_fkey` FOREIGN KEY (`tipoIncapacidadId`) REFERENCES `TipoIncapacidad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MvAusencia` ADD CONSTRAINT `MvAusencia_novedadNominaId_fkey` FOREIGN KEY (`novedadNominaId`) REFERENCES `NovedadNomina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MvHorasExtrasRecargo` ADD CONSTRAINT `MvHorasExtrasRecargo_novedadNominaId_fkey` FOREIGN KEY (`novedadNominaId`) REFERENCES `NovedadNomina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
