import type { Area } from "../types";

export interface CategoryDef {
  id: string;
  area: Area;
  label: string;
  entidad: string;
  tips: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "matricula-comercio",
    area: "legal",
    label: "Matrícula de Comercio",
    entidad: "Fundempresa",
    tips: [
      "Se renueva cada 2 años; renueve antes del vencimiento para evitar multas y bloqueos en trámites bancarios o licitaciones.",
      "Verifique que los representantes legales y poderes inscritos estén vigentes.",
      "Confirme que las actividades económicas registradas coincidan con la operación real.",
      "Guarde el comprobante de renovación junto al testimonio de constitución.",
    ],
  },
  {
    id: "testimonio-poder",
    area: "legal",
    label: "Testimonio de Constitución / Poderes",
    entidad: "Notaría",
    tips: [
      "Revise la vigencia del poder y que las facultades cubran el acto a realizar (banca, juicios, contratos).",
      "Algunas entidades exigen poderes con menos de 1 año o certificación de vigencia notarial.",
      "Si cambió el representante legal, inscriba el cambio antes de firmar nuevos documentos.",
      "Archive el testimonio completo, no fotocopias simples.",
    ],
  },
  {
    id: "nit-padron",
    area: "legal",
    label: "NIT / Padrón (SIN)",
    entidad: "Servicio de Impuestos Nacionales",
    tips: [
      "Actualice domicilio fiscal, actividades económicas y representantes con el Form. 004 si hubo cambios.",
      "Mantenga el facturador (SIAT) operativo; suspendido = multas.",
      "Aunque no haya movimiento, presente declaraciones mensuales en cero.",
      "Conserve constancias de inscripción y últimos cambios presentados.",
    ],
  },
  {
    id: "licencia-funcionamiento",
    area: "legal",
    label: "Licencia de Funcionamiento / Patente",
    entidad: "Gobierno Autónomo Municipal",
    tips: [
      "Renueve cada año según calendario municipal; operar sin ella implica clausura y multas.",
      "Debe coincidir: actividad, dirección y nombre comercial con matrícula y NIT.",
      "Requiere habitable vigente y patente tributaria sin deudas.",
      "Exhíbala en lugar visible del establecimiento (obligación legal).",
    ],
  },
  {
    id: "habitabilidad",
    area: "legal",
    label: "Certificado de Habitabilidad",
    entidad: "Gobierno Autónomo Municipal",
    tips: [
      "Es requisito para la licencia de funcionamiento; verifique su vigencia anual.",
      "Si hubo remodelación o cambio de uso del inmueble, tramítese nuevamente.",
      "El inquilino debe coordinar con el propietario: confirme quién lo gestiona.",
    ],
  },
  {
    id: "licencia-ambiental",
    area: "legal",
    label: "Licencia Ambiental (CCC/CII)",
    entidad: "MMAyA / Gobernación",
    tips: [
      "Según la categoría (1 a 4) corresponde DIA, PPP o EC; verifique cuál tiene su actividad.",
      "Cumpla las auditorías ambientales periódicas; su vencimiento invalida la licencia.",
      "Actualice el RASIM cuando cambien emisiones, residuos o procesos.",
      "Mantenga registros de residuos peligrosos y su disposición final.",
    ],
  },
  {
    id: "poliza-seguro",
    area: "legal",
    label: "Póliza de Seguro (incendio / todo riesgo)",
    entidad: "Aseguradora",
    tips: [
      "Compare la suma asegurada con el valor de reposición actual; ajuste con endoso antes de renovar.",
      "Si hay crédito bancario, verifique el endoso a favor del banco y sus requisitos mínimos.",
      "Lea exclusiones (fenómenos naturales, lucro cesante) y montos de deducible.",
      "Renove con 15 días de anticipación para evitar períodos sin cobertura.",
    ],
  },
  {
    id: "soat",
    area: "legal",
    label: "SOAT",
    entidad: "Aseguradora autorizada por la APS",
    tips: [
      "Obligatorio para circular; sin SOAT hay multa e inmovilización del vehículo.",
      "Verifique placa, marca, modelo y año exactos antes de pagar.",
      "No existe período de gracia: compre antes del vencimiento.",
      "Lleve copia física o digital dentro del vehículo.",
    ],
  },
  {
    id: "rtv",
    area: "legal",
    label: "Revisión Técnica Vehicular (RTV)",
    entidad: "Planta COTAVI autorizada",
    tips: [
      "Programe cita según calendario de placas de su municipio.",
      "Para aprobarla necesita SOAT vigente, papeles al día y vehículo sin observaciones.",
      "Si reprueba, corrija y reprograme: circular con RTV vencida es infracción grave.",
      "Registre la fecha de cada unidad de la flota en esta app para escalonar revisiones.",
    ],
  },
  {
    id: "contrato-alquiler",
    area: "legal",
    label: "Contrato de Alquiler / Arrendamiento",
    entidad: "Contraparte",
    tips: [
      "Negocie la renovación con 60 días de anticipación; evita desalojos sorpresivos.",
      "Revise cláusulas de incremento anual, garantía y penalidades.",
      "Documente el estado del inmueble con acta e inventario firmados.",
      "Confirme que el propietario esté al día en impuestos del inmueble (ALP).",
    ],
  },
  {
    id: "boletas-garantia",
    area: "legal",
    label: "Boletas de Garantía",
    entidad: "Banco",
    tips: [
      "La vigencia debe cubrir todo el contrato más un período de gracia (30–90 días).",
      "Al terminar el contrato, solicite por escrito la devolución o cancelación de la boleta.",
      "Vencida sin devolución, el banco puede seguir cobrando comisiones y ejecutarla.",
      "Lleve un registro centralizado: es el motivo clásico de pérdidas evitables.",
    ],
  },
  {
    id: "marca-senapi",
    area: "legal",
    label: "Registro de Marca",
    entidad: "SENAPI",
    tips: [
      "Dura 10 años y es renovable indefinidamente; SENAPI no avisa el vencimiento.",
      "La solicitud de renovación puede presentarse dentro del último año de vigencia.",
      "Use la marca tal como fue registrada; cambios sustanciales requieren nuevo registro.",
      "Monitoree gacetas por oposiciones de terceros.",
    ],
  },
  {
    id: "planillas-trabajo",
    area: "legal",
    label: "Planillas y Registros Laborales",
    entidad: "Min. de Trabajo / AFP / Caja",
    tips: [
      "Presente las planillas quincenales/mensuales dentro del plazo legal (SIREVE).",
      "Deposite aportes a AFP y Caja de Salud en los primeros días hábiles; mora genera recargos.",
      "Registre altas y bajas de personal oportunamente para evitar pasivos laborales.",
      "Tenga el Libro de Sueldos y Jornales legalizado y actualizado.",
    ],
  },
  {
    id: "eeff-deposito",
    area: "legal",
    label: "Depósito de Estados Financieros",
    entidad: "SEPREC / Registro de Comercio",
    tips: [
      "Deposite anualmente los EEFF auditados ante el Registro de Comercio.",
      "La presentación tardía acarrea multas y observa la imagen registral de la empresa.",
      "Coordine con el auditor externo la firma y emisión oportuna del dictamen.",
    ],
  },
  {
    id: "libro-reclamaciones",
    area: "legal",
    label: "Libro de Reclamaciones (Ley 453)",
    entidad: "Autoridad de Defensa del Consumidor",
    tips: [
      "Debe estar disponible y visible para el cliente en todo punto de venta u oficina.",
      "Las inspecciones verifican existencia, folios habilitados y hoja informativa publicada.",
      "Responda los reclamos dentro del plazo legal y archive evidencias.",
    ],
  },
  {
    id: "registro-sanitario",
    area: "legal",
    label: "Registro Sanitario (SENASAG)",
    entidad: "SENASAG",
    tips: [
      "Cada producto requiere su registro; verifique vigencia producto por producto.",
      "El trámite de renovación es largo: inicie 90 días antes del vencimiento.",
      "Cambios de formulación, etiqueta o establecimiento exigen actualizar el registro.",
      "Sin registro sanitario vigente está prohibido fabricar, importar ni vender.",
    ],
  },
  {
    id: "extintores",
    area: "mantenimiento",
    label: "Recarga de Extintores",
    entidad: "Empresa certificada / Bomberos",
    tips: [
      "Recarga y mantenimiento ANUAL obligatorio por empresa autorizada, con etiqueta sellada.",
      "Prueba hidrostática del cilindro cada 5 años.",
      "Verifique señalización, acceso libre y altura de instalación (manijas a ~1.20 m).",
      "Mantenga bitácora y plano de ubicación; bomberos y municipio pueden inspeccionar.",
    ],
  },
  {
    id: "contra-incendios",
    area: "mantenimiento",
    label: "Sistema Contra Incendios",
    entidad: "Empresa certificada",
    tips: [
      "Prueba de flujo y presión de bombas al menos una vez al año.",
      "Detectores y panel de alarma: prueba funcional semestral.",
      "Rociadores y mangueras: verificar obstrucciones y fechas de prueba.",
      "Documente cada intervención con informe técnico para aseguradoras y municipios.",
    ],
  },
  {
    id: "ascensores",
    area: "mantenimiento",
    label: "Ascensores / Montacargas",
    entidad: "Empresa autorizada + Municipio",
    tips: [
      "Mantenimiento mensual con libreta de registro firmada.",
      "Certificación anual de seguridad obligatoria; sin ella el seguro puede negar siniestros.",
      "Pruebe botón de emergencia e interfon en cada revisión.",
      "Considere contrato que incluya repuestos críticos para evitar paradas largas.",
    ],
  },
  {
    id: "generador",
    area: "mantenimiento",
    label: "Generador Eléctrico",
    entidad: "Proveedor / Interno",
    tips: [
      "Prueba mensual bajo carga durante 20–30 minutos con registro.",
      "Cambio de aceite y filtros según horas de uso, no solo calendario.",
      "Verifique nivel y calidad del combustible; limpie el tanque una vez al año.",
      "Revise baterías de arranque y transferencia automática.",
    ],
  },
  {
    id: "ups-baterias",
    area: "mantenimiento",
    label: "UPS / Baterías",
    entidad: "Proveedor TI",
    tips: [
      "Prueba de autonomía semestral con carga real.",
      "Las baterías duran 2–3 años: programe su reemplazo antes de fallar.",
      "Verifique ventilación y temperatura de sala; el calor mata baterías.",
      "Documente tiempos de respaldo por equipo crítico.",
    ],
  },
  {
    id: "aire-ac",
    area: "mantenimiento",
    label: "Aire Acondicionado / Ventilación",
    entidad: "Proveedor HVAC",
    tips: [
      "Limpieza de filtros y serpentines semestral como mínimo.",
      "Verifique niveles de gas refrigerante y hermeticidad.",
      "Destape drenajes: las filtraciones dañan techos y equipos.",
      "En oficinas, coordine fuera de horario laboral para no interrumpir operaciones.",
    ],
  },
  {
    id: "puesta-tierra",
    area: "mantenimiento",
    label: "Instalación Eléctrica / Puesta a Tierra",
    entidad: "Electricista certificado",
    tips: [
      "Medición anual de resistencia de puesta a tierra; valores altos = riesgo de choque.",
      "Termografía de tableros eléctricos una vez al año previene incendios.",
      "Revise protectores contra sobretensión (SPD) y diferenciales.",
      "Exija informe con fotos y valores medidos para el expediente de mantenimiento.",
    ],
  },
  {
    id: "tanques-agua",
    area: "mantenimiento",
    label: "Tanques de Agua / Desinfección",
    entidad: "Empresa sanitaria certificada",
    tips: [
      "Limpieza y desinfección semestral de cisternas y tanques elevados.",
      "Solicite análisis de cloro residual y potabilidad después de cada limpieza.",
      "Tapas cerradas y selladas: evitan contaminación y vectores.",
      "Registre certificados: APS y municipio pueden solicitarlos.",
    ],
  },
  {
    id: "vehiculo-preventivo",
    area: "mantenimiento",
    label: "Mantenimiento Vehicular Preventivo",
    entidad: "Taller autorizado",
    tips: [
      "Programar por kilometraje: aceite y filtros cada 5.000–10.000 km según modelo.",
      "No olvide correas, frenos y alineación; revise manual del fabricante.",
      "Lleve hoja de vida por placa con gastos y repuestos para presupuestos anuales.",
      "Escalone fechas entre vehículos para no dejar la operación sin movilidad.",
    ],
  },
  {
    id: "servidores-backup",
    area: "mantenimiento",
    label: "Servidores / Respaldo de Datos",
    entidad: "Área de Sistemas",
    tips: [
      "Verifique los respaldos SEMANALMENTE y pruebe una restauración mensual real.",
      "Un backup nunca probado no es un backup: documente la prueba.",
      "Limpieza física interna semestral y monitoreo de discos SMART.",
      "Antivirus, sistemas y licencias: incluya sus vencimientos en este registro.",
    ],
  },
  {
    id: "balanzas-metrologia",
    area: "mantenimiento",
    label: "Balanzas / Metrología Legal",
    entidad: "SENASAG – Metrología",
    tips: [
      "Toda balanza usada en comercio requiere verificación anual del SENASAG.",
      "Precintos intactos: si se rompieron, solicite reverificación.",
      "Guarde certificados visibles cerca del instrumento.",
    ],
  },
  {
    id: "calderas-presion",
    area: "mantenimiento",
    label: "Calderas / Equipos a Presión",
    entidad: "Inspector autorizado",
    tips: [
      "Certificación anual obligatoria: es equipo de alta responsabilidad legal.",
      "Solo operadores capacitados; conserve credenciales.",
      "Calibre manómetros y pruebe válvulas de seguridad periódicamente.",
      "Un accidente sin certificación vigente compromete penalmente a la administración.",
    ],
  },
  {
    id: "plan-emergencias",
    area: "mantenimiento",
    label: "Plan de Emergencias / Simulacro",
    entidad: "Bomberos / Municipio",
    tips: [
      "Actualice el plan y ejecute al menos un simulacro anual (los municipios lo exigen).",
      "Rutas de evacuación señalizadas y libres de obstáculos en todo momento.",
      "Capacite brigadas y renueve kits de emergencia.",
      "Archive acta y fotografías del simulacro: es evidencia de cumplimiento.",
    ],
  },
];

export function categoriesByArea(area: Area): CategoryDef[] {
  return CATEGORIES.filter((c) => c.area === area);
}

export function categoryById(id: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
