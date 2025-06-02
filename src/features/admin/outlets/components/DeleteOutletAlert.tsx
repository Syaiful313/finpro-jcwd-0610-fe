import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface DeleteOutletAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outletToDelete: {
    id: number;
    outletName: string;
  } | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteOutletAlert({
  open,
  onOpenChange,
  outletToDelete,
  onConfirm,
  isDeleting = false,
}: DeleteOutletAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Hapus Outlet</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus outlet{" "}
            <strong>{outletToDelete?.outletName}</strong>? Tindakan ini tidak dapat
            dibatalkan dan akan menghapus semua data terkait termasuk karyawan dan 
            riwayat pesanan di outlet ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus Outlet"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}