import type { Equipment } from "../../api/equipments/equipments";
import { PrimaryButton } from "../Buttons/PrimaryButton";

interface DetailsDialogProps {
  data: Equipment | undefined;
  cancelClick: () => void;
}

export const DetailsDialog = ({ data, cancelClick }: DetailsDialogProps) => {
  const details = [
    { label: "Naziv opreme", value: data?.name },
    { label: "Opis", value: data?.desc },
    { label: "Kategorija", value: data?.categoryName },
    { label: "Proizvođač", value: data?.manufacturer },
    { label: "Model proizvođača", value: data?.manufacturerModel },
    { label: "Serijski broj", value: data?.serialNumber },
    { label: "Godina kupovine", value: data?.purchaseYear },
    { label: "Inventarski broj", value: data?.inventoryNumber },
    { label: "Lokacija", value: data?.homeLocationDescription },
    { label: "Status", value: data?.status },
    { label: "ID nadređene opreme", value: data?.parentEquipmentId },
    { label: "Naziv nadređene opreme", value: data?.parentEquipmentName },
    { label: "Odgovorno lice - ime", value: data?.responsibleFirstName },
    { label: "Odgovorno lice - prezime", value: data?.responsibleLastName },
    { label: "Stručnjak - ime", value: data?.expertFirstName },
    { label: "Stručnjak - prezime", value: data?.expertLastName },
    { label: "Slika", value: data?.image },
    { label: "Napomena", value: data?.notes },
    { label: "Kreirano", value: data?.createdAt },
    { label: "Ažurirano", value: data?.updatedAt },
    { label: "Obrisano", value: data?.deleted },
    { label: "Dodatna oprema", value: data?.accessories },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-[2px]">
        <div className="surface-card my-auto grid max-h-[90vh] w-full max-w-4xl grid-cols-1 gap-4 overflow-y-auto p-6 shadow-2xl md:grid-cols-2">
          <h1 className="text-lg font-semibold text-slate-900 md:col-span-2">
            Detalji o opremi
          </h1>
          <div className="md:col-span-2">
            <img
              src={`http://localhost:8080${String(data?.image)}`}
              alt="slika_opreme"
              className="max-h-64 w-full rounded-xl bg-slate-100 object-contain"
            />
          </div>
          {details.map((el, index) =>
            el.value ? (
              <div
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                key={index}
              >
                <strong className="font-medium text-slate-900">
                  {el.label}:
                </strong>{" "}
                {String(el.value)}
              </div>
            ) : null,
          )}

          <PrimaryButton
            buttonColor="white"
            buttonType="button"
            buttonText="zatvori"
            onClick={cancelClick}
          />
        </div>
      </div>
    </>
  );
};
