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

interface DeleteLaundryItemAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  laundryItemToDelete: {
    id: number;
    name: string;
    category: string;
  } | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteLaundryItemAlert({
  open,
  onOpenChange,
  laundryItemToDelete,
  onConfirm,
  isDeleting = false,
}: DeleteLaundryItemAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Hapus Item Laundry</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus item laundry{" "}
            <strong>{laundryItemToDelete?.name}</strong> dari kategori{" "}
            <strong>{laundryItemToDelete?.category}</strong>? Tindakan ini tidak dapat
            dibatalkan dan item akan dihapus dari sistem.
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
              "Hapus Item"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}