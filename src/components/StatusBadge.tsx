import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge } from "./ui/badge";

export default function StatusBadge({ status }: { status: string }) {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-4 h-4 mr-2" />
          Aprovado
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-4 h-4 mr-2" />
          Rejeitado
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-4 h-4 mr-2" />
          Pendente
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          <AlertCircle className="w-4 h-4 mr-2" />
          Cancelado
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          <AlertCircle className="w-4 h-4 mr-2" />
          {status}
        </Badge>
      );
  }
};