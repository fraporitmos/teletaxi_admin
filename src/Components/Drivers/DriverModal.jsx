import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../Modal";
import RemoteService from "../../Network/RemoteService";
import "../../App.css";

function DriverModal({ isOpen, onClose }) {
  const [cities, setCitys] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [soatFile, setSoatFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);

  const hasFetchedCitys = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchItems = async () => {
      try {
        if (!hasFetchedCitys.current) {
          const { items } = await RemoteService.get(
            "/collections/city/records"
          );
          setCitys(items);
          hasFetchedCitys.current = true;
        }
      } catch (err) {
        alert("Failed to fetch drivers. " + err);
      }
    };
    fetchItems();
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { plate, model, color, unit, year } = data;
      const vehicleRequest = { plate, model, color, unit, year };
      const response = await RemoteService.post(
        "/collections/vehicle/records",
        vehicleRequest
      );
      if (response.id) {
        postDriver(response.id, data);
      }
    } catch (err) {
      alert("Failed to submit driver. " + err);
    }
  };

  const postDriver = async (vehicleId, data) => {
    try {
      const formData = new FormData();
      console.log(data)
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (photoFile) {
        formData.append("photo", photoFile);
      }
      if (licenseFile) {
        formData.append("license", licenseFile);
      }
      if (soatFile) {
        formData.append("soat", soatFile);
      }

      formData.append("vehicleId", vehicleId);
      formData.append("statusDriver", "pendiente");
      var resp = await RemoteService.post(
        "/collections/driver/records",
        formData
      );
      var fullPhotoUrl = `${import.meta.env.VITE_API_POCKET_URL}/files/${resp.collectionId}/${resp.id}/${resp.photo}`;
      var fullSoatUrl = `${import.meta.env.VITE_API_POCKET_URL}/files/${resp.collectionId}/${resp.id}/${resp.soat}`;
      var fullLicenseUrl = `${import.meta.env.VITE_API_POCKET_URL}/files/${resp.collectionId}/${resp.id}/${resp.license}`;

      await RemoteService.patch(`/collections/driver/records/${resp.id}`, {
        photoUrlDriver: fullPhotoUrl,
        soatUrlDriver: fullSoatUrl,
        licenseUrlDriver: fullLicenseUrl,
      });
      reset();
      setPhotoFile(null);
      setSoatFile(null);
      setLicenseFile(null);
      onClose();
    } catch (err) {
      alert("Failed to submit driver. " + err);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 scroll-default  max-h-[80vh] overflow-y-auto custom-scroll"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="namesDriver" className="text-onBackground">
              Nombres completos
            </label>
            <input
              id="namesDriver"
              {...register("namesDriver", {
                required: "El nombre es obligatorio",
              })}
              className="block w-full px-4 py-2  bg-white border border-primary rounded-md text-dark focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
            {errors.names && (
              <p className="mt-1 text-sm text-red-600">
                {errors.names.message}
              </p>
            )}
          </div>
            <div>
            <label htmlFor="documentNumber" className="text-onBackground">
              Dni
            </label>
            <input
              id="documentNumber"
              type="text"
              maxLength={8}
              {...register("documentNumber", {
                required: "El DNI es obligatorio",
                pattern: {
                  value: /^\d{8}$/,
                  message: "El DNI debe tener 8 dígitos",
                },
              })}
              className="block w-full px-4 py-2  bg-white border border-primary  rounded-md text-black    focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
            {errors.documentNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.documentNumber.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="emailDriver" className="text-onBackground">
              Correo
            </label>
            <input
              id="emailDriver"
              type="email"
              {...register("emailDriver", {
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "El correo es inválido",
                },
              })}
              className="block w-full px-4 py-2  bg-white border border-primary  rounded-md text-black    focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phoneDriver" className="text-onBackground">
              Telefono
            </label>
            <input
              id="phoneDriver"
              type="text"
              maxLength={9}
              {...register("phoneDriver", {
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^9\d{8}$/,
                  message: "El teléfono debe tener 9 dígitos y empezar en 9",
                },
              })}
              className="block w-full px-4 py-2  bg-white border border-primary rounded-md text-dark    focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
            {errors.phoneDriver && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phoneDriver.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-onBackground">
              Clave de acceso
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "La clave es obligatoria",
                minLength: {
                  value: 6,
                  message: "La clave debe tener al menos 6 caracteres",
                },
              })}
              className="block w-full px-4 py-2  bg-white border border-primary  rounded-md   text-black     focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cityId" className="text-onBackground">
              Ciudad
            </label>
            <select
              id="cityId"
              {...register("cityId", { required: "City is required" })}
              className="block w-full px-4 py-2  bg-white border border-gray-200 rounded-md text-black dark:border-gray-600 focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.nameCity}
                </option>
              ))}
            </select>
            {errors.cityId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cityId.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="photo" className="text-onBackground">
              Foto
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              className="block w-full px-4 py-1 bg-white border border-primary rounded-md"
            />
          </div>

          <div>
            <label htmlFor="plate" className="text-onBackground">
              Placa del vehiculo
            </label>
            <input
              id="plate"
              {...register("plate", { required: "La placa es obligatoria" })}
              className="block w-full px-4 py-2  bg-white border border-primary rounded-md text-dark focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
            {errors.plate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.plate.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="license" className="text-onBackground">
              Licencia
            </label>
            <input
              id="license"
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              onChange={(e) => setLicenseFile(e.target.files[0])}
              className="block w-full px-4 py-1 bg-white border border-primary rounded-md"
            />
          </div>

          <div>
            <label htmlFor="model" className="text-onBackground">
              Modelo del vehiculo
            </label>
            <input
              id="model"
              {...register("model", { required: "El modelo es obligatoria" })}
              className="block w-full px-4 py-2  bg-white border border-primary rounded-md text-dark focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">
                {errors.model.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="soat" className="text-onBackground">
              Soat
            </label>
            <input
              id="soat"
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              onChange={(e) => setSoatFile(e.target.files[0])}
              className="block w-full px-4 py-1 bg-white border border-primary rounded-md"
            />
          </div>

          <div>
            <label htmlFor="year" className="text-onBackground">
              Año del vehiculo
            </label>
            <input
              id="year"
              {...register("year", { required: "El año es obligatoria" })}
              className="block w-full px-4 py-2  bg-white border border-primary rounded-md text-dark focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="color" className="text-onBackground">
              Color del vehiculo
            </label>
            <input
              id="color"
              {...register("color", { required: "El color es obligatoria" })}
              className="block w-full px-4 py-2  bg-white border border-primary rounded-md text-dark focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">
                {errors.color.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="unit" className="text-onBackground">
              Numero de unidad
            </label>
            <input
              id="unit"
              {...register("unit", { required: "Nmr de unidad obligatoria" })}
              className="block w-full px-4 py-2  bg-white border border-primary rounded-md text-dark focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
            {errors.unit && (
              <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-4 text-white bg-primary rounded-lg hover:bg-primaryDark transition-colors duration-200"
        >
          Registrar
        </button>
      </form>
    </Modal>
  );
}

export default DriverModal;
