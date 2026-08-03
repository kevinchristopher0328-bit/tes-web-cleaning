/**
 * Alamat terstruktur — disimpan sebagai JSON di kolom profiles.address_1 /
 * address_2, dipakai bersama oleh halaman profil dan form pemesanan.
 */
export type Address = {
  label: string;
  street: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  postalCode: string;
  note: string;
};

export function emptyAddress(): Address {
  return {
    label: "Rumah",
    street: "",
    rtRw: "",
    kelurahan: "",
    kecamatan: "",
    city: "",
    province: "",
    postalCode: "",
    note: "",
  };
}

// Baca alamat dari kolom: JSON (format baru) atau teks biasa (data lama).
export function parseAddress(raw: string | null, labelCol: string | null): Address | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Partial<Address>;
    if (o && typeof o === "object" && !Array.isArray(o)) {
      return {
        label: o.label ?? labelCol ?? "",
        street: o.street ?? "",
        rtRw: o.rtRw ?? "",
        kelurahan: o.kelurahan ?? "",
        kecamatan: o.kecamatan ?? "",
        city: o.city ?? "",
        province: o.province ?? "",
        postalCode: o.postalCode ?? "",
        note: o.note ?? "",
      };
    }
  } catch {
    // Bukan JSON — perlakukan sebagai alamat teks lama.
  }
  return { ...emptyAddress(), label: labelCol ?? "", street: raw };
}

// Baris tampilan alamat (buang bagian yang kosong).
export function addressLines(a: Address): string[] {
  const lines: string[] = [];
  if (a.street) lines.push(a.street);
  if (a.rtRw) lines.push(`RT/RW ${a.rtRw}`);
  const kel = [
    a.kelurahan && `Kel. ${a.kelurahan}`,
    a.kecamatan && `Kec. ${a.kecamatan}`,
  ]
    .filter(Boolean)
    .join(", ");
  if (kel) lines.push(kel);
  const cityLine = [[a.city, a.province].filter(Boolean).join(", "), a.postalCode]
    .filter(Boolean)
    .join(" ");
  if (cityLine) lines.push(cityLine);
  return lines;
}

// Petakan alamat tersimpan ke field form pemesanan.
export function addressToBookingFields(a: Address) {
  const address = [
    a.street,
    a.rtRw ? `RT/RW ${a.rtRw}` : "",
    a.kelurahan ? `Kel. ${a.kelurahan}` : "",
    a.kecamatan ? `Kec. ${a.kecamatan}` : "",
  ]
    .filter(Boolean)
    .join(", ");
  return {
    address,
    city: a.city,
    postalCode: a.postalCode,
    addressNote: a.note,
  };
}
