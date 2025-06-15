import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InfoCard() {
  return (
    <Card>
      <CardContent >
        <CardTitle className="text-lg pb-3">Info</CardTitle>
        <div className="text-muted-foreground space-y-2 pt-0 text-sm">
          <p>
            • Total berat <strong>opsional</strong> untuk item per pcs,{" "}
            <strong>wajib</strong> untuk item per kg
          </p>
          <p>
            • Pilih jenis item dan isi quantity/berat sesuai dengan tipe pricing
          </p>
          <p>
            • Detail item bersifat opsional untuk breakdown yang lebih spesifik
          </p>
          <p>
            • Ongkos kirim akan dihitung otomatis berdasarkan jarak ke customer
          </p>
          <p>• Setelah diproses, pesanan akan masuk ke tahap pencucian</p>
        </div>
      </CardContent>
    </Card>
  );
}
