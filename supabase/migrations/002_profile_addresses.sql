-- Dua alamat tersimpan per profil. Slot 1 (address_1) selalu jadi alamat utama;
-- "jadikan utama" cukup menukar slot 1 dan slot 2 di aplikasi.
alter table public.profiles
  add column if not exists address_1 text,
  add column if not exists address_1_label text,
  add column if not exists address_2 text,
  add column if not exists address_2_label text;
