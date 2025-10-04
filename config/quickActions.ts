import { QrCode, BookOpen, MessageSquare, FileSpreadsheet } from 'lucide-react';

export const quickActions = [
  { text: 'Tomar Asistencia QR', icon: QrCode, path: '/asistencia/scan' },
  { text: 'Revisar Carga de Notas', icon: BookOpen, path: '/academico/avance-docentes' },
  { text: 'Enviar Comunicado', icon: MessageSquare, path: '/comunicaciones' },
  { text: 'Generar Reporte UGEL', icon: FileSpreadsheet, path: '/reportes' },
];