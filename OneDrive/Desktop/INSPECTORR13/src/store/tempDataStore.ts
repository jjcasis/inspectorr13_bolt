import { create } from 'zustand';

// Interface Definitions (manteniendo las existentes)
interface ElementosInforme {
  id: string;
  titulo: string;
  fecha: string;
  modulo: string;
  nivel: string;
  tipo: string;
  items: {
    categoria: string;
    subelemento: string;
    estado: string;
    observacion: string;
    imagen: any; // Considerar un tipo más específico si es posible
    ambiente: string;
  }[];
}

interface ImagenData { // Tipo más específico para imágenes si es posible
    src: string;
    etiqueta?: string;
    categoria?: string;
    subelemento?: string;
    comentario?: string;
    fechaCreacion?: string | Date;
    etiquetas?: string[];
    // otros campos...
}

interface EstadoInforme {
  estado: Record<string, Record<string, string>>; // Estado de inspección
  comentarios: string;
  imagenes: ImagenData[]; // Usar ImagenData si es posible, si no, any[]
  layout: string; // Layout específico del ambiente (podría ser obsoleto para exportación)
  visible?: boolean; // Visibilidad en la UI/exportación?
  nombre?: string; // Nombre personalizado del ambiente
  categoriasVisibles?: Record<string, boolean>; // Qué categorías mostrar en tabla
  fecha?: string; // Fecha asociada al informe de este ambiente
}

interface Configuracion {
  etiquetas: {
    imagenes: Record<string, string[]>;
    comentarios: Record<string, string[]>;
    frecuentes: string[];
  };
  estiloInforme: {
    fontFamily: string;
    fontSize: string;
    lineHeight: number;
    firmaNombre: string;
    firmaLinea: string;
    logo: string; // URL o base64
    logoWidth: string;
    logoAlign: 'izquierda' | 'centro' | 'derecha';
    firmaModo: 'texto' | 'imagen';
    firmaImagen: string; // URL o base64
    colorPrimario: string;
    colorSecundario: string;
    colorTexto: string;
    colorFondo: string;
    espaciado: string;
    bordeRadius: string;
  };
  layoutPresets: { // Presets para vistas específicas, no necesariamente exportación directa
    capturaRapida: {
      mostrarPreview: boolean;
      compactMode: boolean;
      imageSize: 'small' | 'medium' | 'large';
      showComments: boolean;
      defaultExpanded: boolean;
    };
    // Podríamos añadir presets de exportación aquí si fuera necesario
  };
  elementosInspeccion: { // Definición de categorías/subelementos disponibles
    categorias: {
      id: string;
      nombre: string;
      activo: boolean;
      subelementos: {
        id: string;
        nombre: string;
        activo: boolean;
      }[];
    }[];
  };
}

interface ExcepcionData {
  categoria: string;
  subelemento: string;
  estado: string;
  observacion: string;
  imagenes: ImagenData[]; // Usar ImagenData si es posible
  ambientes: string[]; // Ambientes a los que aplicar
}

interface CapturaItem {
  imagen: ImagenData; // Usar ImagenData si es posible
  imagenes?: ImagenData[]; // Soporte para múltiples imágenes
  comentario: string;
  categoria: string;
  subelemento: string;
  estado: string;
  modulo: string;
  nivel: string;
  tipo: string;
  ambiente: string; // Ambiente de origen
}

interface InformeCaptura {
  id: string;
  titulo: string;
  fecha: string;
  items: CapturaItem[];
}

interface Checkpoint {
  timestamp: number;
  informesPorAmbiente: Record<string, EstadoInforme>;
  informesCapturaRapida: InformeCaptura[];
}

// --- Interface principal del Store ---
interface DataStore {
  // Estado principal
  modulo: string;
  nivel: string;
  tipo: string;
  ambienteSeleccionado: string; // Ambiente actualmente activo en la UI principal
  informesPorAmbiente: Record<string, EstadoInforme>; // Datos por cada ambiente
  ambientesActivos: string[]; // Lista de IDs de ambientes a incluir en reportes/vistas
  configuracion: Configuracion; // Configuración general y de estilo
  checkpoints: Checkpoint[]; // Para rollback

  // Estado para selección de plantilla de exportación (NUEVO)
  selectedExportTemplateId: string | null;

  // Estado para Captura Rápida
  informesCapturaRapida: InformeCaptura[];
  informeCapturaActivoId: string | null;

  // Estado para Informes por Elementos (si es diferente a por Ambiente)
  informesElementos: ElementosInforme[];
  informeElementosActivoId: string | null;

  // --- Acciones (Setters y Lógica) ---
  setModulo: (m: string) => void;
  setNivel: (n: string) => void;
  setTipo: (t: string) => void;
  setAmbienteSeleccionado: (amb: string) => void;
  setEstadoInforme: (amb: string, cat: string, sub: string, val: string) => void;
  setComentarios: (amb: string, texto: string) => void;
  setImagenes: (amb: string, imgs: ImagenData[]) => void; // Usar ImagenData
  setLayout: (amb: string, layout: string) => void; // Actualiza layout *por ambiente*
  toggleCategoriaActiva: (amb: string, data: string | Record<string, boolean>, inicial?: boolean) => void;
  toggleVisibilidadAmbiente: (amb: string) => void;
  clonarAmbiente: (amb: string) => void;
  eliminarAmbiente: (amb: string) => void;
  updateNombreAmbiente: (amb: string, nuevoNombre: string) => void;
  setConfiguracion: (config: Configuracion) => void;
  setFechaInforme: (amb: string, fecha: string) => void;
  saveDraft: (amb: string, data: EstadoInforme) => void; // Guarda en localStorage
  loadDraft: (amb: string) => EstadoInforme; // Carga desde localStorage
  aplicarExcepcionAMultiplesAmbientes: (data: ExcepcionData) => void;

  // Setter para la plantilla de exportación seleccionada (NUEVO)
  setSelectedExportTemplateId: (id: string | null) => void;

  // Acciones para Elementos de Inspección (Configuración)
  agregarCategoria: (nombre: string) => void;
  editarCategoria: (id: string, nombre: string) => void;
  eliminarCategoria: (id: string) => void;
  toggleCategoriaInspeccion: (id: string) => void;
  agregarSubelemento: (categoriaId: string, nombre: string) => void;
  editarSubelemento: (categoriaId: string, subelementoId: string, nombre: string) => void;
  eliminarSubelemento: (categoriaId: string, subelementoId: string) => void;
  toggleSubelemento: (categoriaId: string, subelementoId: string) => void;

  // Acciones para Captura Rápida
  crearNuevoInformeCaptura: (informe: InformeCaptura) => void;
  guardarItemEnInformeActivo: (item: CapturaItem) => void;
  guardarInformeCaptura: (informe: InformeCaptura) => void;
  activarInformeExistente: (id: string) => void;
  eliminarInformeCaptura: (id: string) => void;
  moverItemArriba: (informeId: string, idx: number) => void;
  moverItemAbajo: (informeId: string, idx: number) => void;
  clonarItem: (informeId: string, idx: number) => void;
  eliminarItem: (informeId: string, idx: number) => void;

  // Acciones para Checkpoints
  createCheckpoint: () => void;
  rollbackToCheckpoint: (timestamp: number) => void;
  deleteCheckpoint: (timestamp: number) => void;

  // Acciones para Informes por Elementos
  crearNuevoInformeElementos: (informe: ElementosInforme) => void;
  guardarInformeElementos: (informe: ElementosInforme) => void;
  activarInformeElementos: (id: string) => void;
  eliminarInformeElementos: (id: string) => void;
  guardarItemEnInformeElementosActivo: (item: any) => void; // Usar tipo específico si es posible
}

// Estado inicial para un informe de ambiente vacío o por defecto
const estadoInformeInicial: Omit<EstadoInforme, 'estado'> = {
  comentarios: '',
  imagenes: [],
  layout: 'grilla', // Layout por defecto por ambiente
  visible: true,
  fecha: new Date().toISOString().slice(0, 10), // Fecha actual por defecto
  categoriasVisibles: {}, // Inicialmente vacío o con valores por defecto si se desea
  nombre: undefined, // Sin nombre personalizado inicialmente
};

// Estado base para la tabla de inspección (ejemplo)
// Podría generarse dinámicamente basado en configuracion.elementosInspeccion
const estadoBaseEjemplo: Record<string, Record<string, string>> = {
  'PAREDES': { 'Bloqueo': '', 'Repello': '', 'Pintura': '' },
  'PUERTA': { 'Marco': '', 'Hoja': '', 'Cerradura': '' }
};


// --- Creación del Store Zustand ---
const useDataStore = create<DataStore>((set, get) => ({
  // Estado Inicial
  modulo: 'A',
  nivel: '000',
  tipo: 'INTERIOR',
  ambienteSeleccionado: '',
  informesPorAmbiente: {}, // Cargar desde localStorage si es necesario al inicio
  ambientesActivos: [], // Cargar desde localStorage si es necesario al inicio
  selectedExportTemplateId: null, // Estado inicial para ID de plantilla (NUEVO)
  configuracion: { // Valores por defecto, podrían cargarse desde config externa/localStorage
    etiquetas: {
      imagenes: {},
      comentarios: {},
      frecuentes: ['reparar', 'revisar', 'no terminado', 'terminado', 'se solicita', 'se detecta', 'se debe'],
    },
    estiloInforme: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11pt', // Tamaño base pt para PDF
      lineHeight: 1.4,
      firmaNombre: 'Inspector Asignado',
      firmaLinea: '_________________________',
      logo: '', // URL del logo
      logoWidth: '150px',
      logoAlign: 'centro',
      firmaModo: 'texto',
      firmaImagen: '',
      colorPrimario: '#0056b3', // Azul más oscuro
      colorSecundario: '#5a6268', // Gris
      colorTexto: '#212529', // Negro suave
      colorFondo: '#ffffff',
      espaciado: '1rem', // Espaciado general
      bordeRadius: '4px' // Bordes redondeados
    },
    layoutPresets: {
      capturaRapida: {
        mostrarPreview: true,
        compactMode: false,
        imageSize: 'medium',
        showComments: true,
        defaultExpanded: true
      }
    },
    elementosInspeccion: { // Ejemplo inicial, debería cargarse/ser configurable
      categorias: [
        {
          id: 'paredes', nombre: 'PAREDES', activo: true,
          subelementos: [
            { id: 'bloqueo', nombre: 'Bloqueo', activo: true },
            { id: 'repello', nombre: 'Repello', activo: true },
            { id: 'pintura', nombre: 'Pintura', activo: true }
          ]
        },
        {
          id: 'ventana', nombre: 'VENTANA', activo: true,
          subelementos: [
            { id: 'marco', nombre: 'Marco', activo: true },
            { id: 'vidrio', nombre: 'Vidrio', activo: true },
            { id: 'sello', nombre: 'Sello', activo: true }
          ]
        },
        {
          id: 'cielorraso', nombre: 'CIELORRASO', activo: true,
          subelementos: [
            { id: 'estructura-angulo', nombre: 'Estructura ángulo', activo: true },
            { id: 'estructura-reticula', nombre: 'Estructura Retícula', activo: true },
            { id: 'laminas', nombre: 'Láminas', activo: true }
          ]
        }
      ]
    }
  },
  checkpoints: JSON.parse(localStorage.getItem('checkpoints') || '[]'),
  informesCapturaRapida: JSON.parse(localStorage.getItem('informesCapturaRapida') || '[]'),
  informeCapturaActivoId: localStorage.getItem('informeCapturaActivoId'),
  informesElementos: JSON.parse(localStorage.getItem('informesElementos') || '[]'),
  informeElementosActivoId: localStorage.getItem('informeElementosActivoId'),

  // --- Implementación de Acciones ---
  setModulo: (m) => set({ modulo: m }),
  setNivel: (n) => set({ nivel: n }),
  setTipo: (t) => set({ tipo: t }),

  setAmbienteSeleccionado: (amb) => {
    const state = get();
    const yaActivo = state.ambientesActivos.includes(amb);

    // Cargar borrador existente o crear uno nuevo si no existe
    const informeCargado = state.loadDraft(amb);

    // Asegurarse de que ambientesActivos se actualice correctamente
    const nuevosAmbientesActivos = yaActivo ? state.ambientesActivos : [...state.ambientesActivos, amb];

    set((prevState) => ({
      ambienteSeleccionado: amb,
      // Asegurarse de que el informe esté en informesPorAmbiente incluso si se acaba de crear
      informesPorAmbiente: { ...prevState.informesPorAmbiente, [amb]: informeCargado },
      ambientesActivos: nuevosAmbientesActivos,
    }));
  },

  setEstadoInforme: (amb, cat, sub, val) => {
    set((state) => {
      const informe = state.informesPorAmbiente[amb] || { ...estadoInformeInicial, estado: estadoBaseEjemplo };
      const nuevoEstado = {
        ...informe.estado,
        [cat]: { ...(informe.estado?.[cat] || {}), [sub]: val },
      };
      const actualizado = { ...informe, estado: nuevoEstado };
      state.saveDraft(amb, actualizado); // Guardar borrador
      return { informesPorAmbiente: { ...state.informesPorAmbiente, [amb]: actualizado } };
    });
  },

  setComentarios: (amb, texto) => {
    set((state) => {
      const informe = state.informesPorAmbiente[amb] || { ...estadoInformeInicial, estado: estadoBaseEjemplo };
      const actualizado = { ...informe, comentarios: texto };
      state.saveDraft(amb, actualizado);
      return { informesPorAmbiente: { ...state.informesPorAmbiente, [amb]: actualizado } };
    });
  },

  setImagenes: (amb, imgs) => {
    set((state) => {
      const informe = state.informesPorAmbiente[amb] || { ...estadoInformeInicial, estado: estadoBaseEjemplo };
      // Validar o mapear 'imgs' a ImagenData[] si es necesario
      const actualizado = { ...informe, imagenes: imgs };
      state.saveDraft(amb, actualizado);
      return { informesPorAmbiente: { ...state.informesPorAmbiente, [amb]: actualizado } };
    });
  },

  // Actualiza el layout *por ambiente*. Puede que no sea relevante para la selección global de plantilla de exportación.
  setLayout: (amb, layout) => {
    set((state) => {
      const informe = state.informesPorAmbiente[amb] || { ...estadoInformeInicial, estado: estadoBaseEjemplo };
      const actualizado = { ...informe, layout };
      state.saveDraft(amb, actualizado);
      return { informesPorAmbiente: { ...state.informesPorAmbiente, [amb]: actualizado } };
    });
  },

  // Implementación de toggleCategoriaActiva (simplificada)
  toggleCategoriaActiva: (amb, data, inicial = false) => {
     set((state) => {
        const informe = state.informesPorAmbiente[amb] || { ...estadoInformeInicial, estado: estadoBaseEjemplo };
        const actuales = informe.categoriasVisibles || {};
        let nuevas: Record<string, boolean> = {};

         if (typeof data === 'string') {
             nuevas = { ...actuales, [data]: !(actuales[data] ?? true) }; // Toggle or default to true then toggle
         } else if (typeof data === 'object') {
             nuevas = inicial ? { ...data } : { ...actuales, ...data };
         }

        const actualizado = { ...informe, categoriasVisibles: nuevas };
        state.saveDraft(amb, actualizado);
        return { informesPorAmbiente: { ...state.informesPorAmbiente, [amb]: actualizado } };
    });
  },

  // Implementación de toggleVisibilidadAmbiente
  toggleVisibilidadAmbiente: (amb) => {
    set((state) => {
      const informe = state.informesPorAmbiente[amb] || { ...estadoInformeInicial, estado: estadoBaseEjemplo };
      const actualizado = { ...informe, visible: !(informe.visible ?? true) }; // Toggle or default to true then toggle
      state.saveDraft(amb, actualizado);
      return { informesPorAmbiente: { ...state.informesPorAmbiente, [amb]: actualizado } };
    });
  },

  // Implementación de clonarAmbiente
  clonarAmbiente: (amb) => {
      const state = get();
      const base = state.informesPorAmbiente[amb];
      if (!base) return;

      let i = 1;
      let nuevoId = `${amb}_CLON_${i}`;
      // Asegurarse de que el nuevo ID no exista ya
      while (state.informesPorAmbiente[nuevoId] || state.ambientesActivos.includes(nuevoId)) {
        i++;
        nuevoId = `${amb}_CLON_${i}`;
      }

      // Clonar profundamente el estado y las imágenes si contienen objetos
      const clon: EstadoInforme = {
        ...estadoInformeInicial, // Empezar con valores por defecto
        ...JSON.parse(JSON.stringify(base)), // Clon profundo del estado base
        nombre: `${base.nombre || amb} (Copia ${i})`, // Nuevo nombre
        fecha: new Date().toISOString().slice(0, 10), // Fecha actual
        visible: true, // Hacer visible el clon por defecto
      };

      state.saveDraft(nuevoId, clon); // Guardar el clon en localStorage

      set((prevState) => ({
        informesPorAmbiente: { ...prevState.informesPorAmbiente, [nuevoId]: clon },
        // Añadir al final de la lista de activos o después del original si se desea
        ambientesActivos: [...prevState.ambientesActivos, nuevoId],
        // Opcional: seleccionar el ambiente clonado
        // ambienteSeleccionado: nuevoId
      }));
   },

  // Implementación de eliminarAmbiente
  eliminarAmbiente: (amb) => {
      set((state) => {
          const { [amb]: _, ...restInformes } = state.informesPorAmbiente;
          localStorage.removeItem(`draft_${amb}`); // Eliminar borrador
          const nuevosAmbientesActivos = state.ambientesActivos.filter((a) => a !== amb);
          // Si el ambiente eliminado era el seleccionado, deseleccionar o seleccionar otro
          const nuevoSeleccionado = state.ambienteSeleccionado === amb
                ? (nuevosAmbientesActivos[0] || '') // Selecciona el primero activo o ninguno
                : state.ambienteSeleccionado;

          return {
              informesPorAmbiente: restInformes,
              ambientesActivos: nuevosAmbientesActivos,
              ambienteSeleccionado: nuevoSeleccionado,
          };
       });
   },

  // Implementación de updateNombreAmbiente
  updateNombreAmbiente: (amb, nuevoNombre) => {
      set((state) => {
          const informe = state.informesPorAmbiente[amb];
          if (!informe) return {}; // No hacer nada si no existe
          const actualizado = { ...informe, nombre: nuevoNombre };
          state.saveDraft(amb, actualizado);
          return { informesPorAmbiente: { ...state.informesPorAmbiente, [amb]: actualizado } };
      });
  },

  // Implementación de setConfiguracion (guardar también en localStorage)
  setConfiguracion: (config) => {
      localStorage.setItem('configuracionApp', JSON.stringify(config)); // Guardar config
      set({ configuracion: config });
   },

   // Implementación de setFechaInforme
   setFechaInforme: (amb, fecha) => {
       set((state) => {
           const informe = state.informesPorAmbiente[amb];
           if (!informe) return {};
           const actualizado = { ...informe, fecha };
           state.saveDraft(amb, actualizado);
           return { informesPorAmbiente: { ...state.informesPorAmbiente, [amb]: actualizado } };
       });
   },

  // --- Funciones de Guardado/Carga ---
  saveDraft: (amb, data) => {
    try {
        localStorage.setItem(`draft_${amb}`, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving draft for ${amb}:`, error);
        // Considerar una notificación al usuario o fallback
    }
  },

  loadDraft: (amb): EstadoInforme => {
    const raw = localStorage.getItem(`draft_${amb}`);
    let loadedData: Partial<EstadoInforme> = {};
    if (raw) {
      try {
        loadedData = JSON.parse(raw);
      } catch (error) {
        console.error(`Error parsing draft for ${amb}, returning default. Error:`, error);
        localStorage.removeItem(`draft_${amb}`); // Eliminar dato corrupto
        // Retorna estado inicial completo en caso de error
         return {
              estado: estadoBaseEjemplo, // O generar desde config
              ...estadoInformeInicial // Resto de valores iniciales
         };
      }
    }
    // Fusionar datos cargados con el estado inicial para asegurar que todos los campos existan
    return {
      estado: loadedData.estado || estadoBaseEjemplo, // Usar estado cargado o el base
      comentarios: loadedData.comentarios ?? estadoInformeInicial.comentarios,
      imagenes: loadedData.imagenes ?? estadoInformeInicial.imagenes,
      layout: loadedData.layout ?? estadoInformeInicial.layout,
      visible: loadedData.visible ?? estadoInformeInicial.visible,
      nombre: loadedData.nombre ?? estadoInformeInicial.nombre,
      categoriasVisibles: loadedData.categoriasVisibles ?? estadoInformeInicial.categoriasVisibles,
      fecha: loadedData.fecha ?? estadoInformeInicial.fecha,
    };
  },

  // Implementación de aplicarExcepcionAMultiplesAmbientes
  aplicarExcepcionAMultiplesAmbientes: ({ categoria, subelemento, estado, observacion, imagenes, ambientes }) => {
       set((state) => {
           const fechaActual = new Date().toISOString().slice(0, 10);
           const nuevosInformes = { ...state.informesPorAmbiente };

           ambientes.forEach((amb) => {
               // Cargar el estado actual, asegurando que es un objeto completo
               const original = state.loadDraft(amb);
               // Calcular nuevo estado de inspección
               const nuevoEstadoInsp = {
                 ...original.estado,
                 [categoria]: {
                   ...(original.estado?.[categoria] || {}),
                   [subelemento]: estado,
                 },
               };
               // Añadir observación de excepción
               const nuevosComentarios = original.comentarios
                 ? `${original.comentarios}\n[EXCEPCIÓN] ${observacion}`
                 : `[EXCEPCIÓN] ${observacion}`;
               // Añadir imágenes de excepción
               const nuevasImagenes = [...(original.imagenes || []), ...imagenes];

               // Crear el objeto actualizado completo
               const actualizado: EstadoInforme = {
                 ...original, // Mantener otros campos como nombre, visible, etc.
                 estado: nuevoEstadoInsp,
                 comentarios: nuevosComentarios,
                 imagenes: nuevasImagenes,
                 fecha: original.fecha || fechaActual, // Mantener fecha original si existe
               };

               state.saveDraft(amb, actualizado); // Guardar borrador actualizado
               nuevosInformes[amb] = actualizado; // Actualizar en el estado del store
           });

           return { informesPorAmbiente: nuevosInformes };
       });
   },

   // ---- Setter para la plantilla seleccionada (NUEVO) ----
   setSelectedExportTemplateId: (id) => {
       console.log("Setting selectedExportTemplateId:", id); // Log para debugging
       set({ selectedExportTemplateId: id });
   },


  // --- Implementaciones de Acciones Restantes (Elementos Inspección, Captura Rápida, Checkpoints, etc.) ---
  // (Se mantienen las implementaciones proporcionadas, asumiendo que son correctas para su propósito)
  // ... (código de acciones para agregarCategoria, editarCategoria, etc.) ...
    agregarCategoria: (nombre) => {
        const state = get();
        const nuevaConfig = { ...state.configuracion };
        // Validar si ya existe una categoría con ese nombre o ID similar
        const id = nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (nuevaConfig.elementosInspeccion.categorias.some(c => c.id === id || c.nombre === nombre.toUpperCase())) {
            console.warn(`Categoría "${nombre}" ya existe.`);
            return; // Evitar duplicados
        }
        const nuevaCategoria = {
          id: id,
          nombre: nombre.toUpperCase(),
          activo: true,
          subelementos: []
        };
        nuevaConfig.elementosInspeccion.categorias.push(nuevaCategoria);
        state.setConfiguracion(nuevaConfig); // Usar setConfiguracion para guardar en LS
   },
   editarCategoria: (id, nombre) => {
        set((state) => {
            const nuevaConfig = JSON.parse(JSON.stringify(state.configuracion)); // Clon profundo
            const categoria = nuevaConfig.elementosInspeccion.categorias.find((c: any) => c.id === id);
            if (categoria) {
                 // Validar si el nuevo nombre ya existe (ignorando la categoría actual)
                 if (nuevaConfig.elementosInspeccion.categorias.some((c: any) => c.id !== id && c.nombre === nombre.toUpperCase())) {
                    console.warn(`Ya existe otra categoría con el nombre "${nombre}".`);
                     return {}; // No modificar estado si hay conflicto
                 }
                 categoria.nombre = nombre.toUpperCase();
                 state.setConfiguracion(nuevaConfig); // Usar setConfiguracion para guardar
            }
             return { configuracion: nuevaConfig }; // Devolver estado actualizado o el mismo si no hubo cambios
        });
   },
   eliminarCategoria: (id) => {
        set((state) => {
            const nuevaConfig = { ...state.configuracion };
            nuevaConfig.elementosInspeccion.categorias = nuevaConfig.elementosInspeccion.categorias.filter((c: any) => c.id !== id);
            state.setConfiguracion(nuevaConfig); // Usar setConfiguracion para guardar
            return { configuracion: nuevaConfig };
        });
   },
   toggleCategoriaInspeccion: (id) => {
       set((state) => {
            const nuevaConfig = JSON.parse(JSON.stringify(state.configuracion)); // Clon profundo
            const categoria = nuevaConfig.elementosInspeccion.categorias.find((c: any) => c.id === id);
            if (categoria) {
                categoria.activo = !categoria.activo;
                state.setConfiguracion(nuevaConfig);
            }
             return { configuracion: nuevaConfig };
        });
   },
   agregarSubelemento: (categoriaId, nombre) => {
       set((state) => {
            const nuevaConfig = JSON.parse(JSON.stringify(state.configuracion)); // Clon profundo
            const categoria = nuevaConfig.elementosInspeccion.categorias.find((c: any) => c.id === categoriaId);
            if (categoria) {
                 const id = nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                 if (categoria.subelementos.some((s: any) => s.id === id || s.nombre === nombre)) {
                    console.warn(`Subelemento "${nombre}" ya existe en la categoría "${categoria.nombre}".`);
                     return { configuracion: state.configuracion }; // No modificar
                 }
                 categoria.subelementos.push({ id: id, nombre: nombre, activo: true });
                 state.setConfiguracion(nuevaConfig); // Guardar
             }
             return { configuracion: nuevaConfig };
         });
   },
   editarSubelemento: (categoriaId, subelementoId, nombre) => {
       set((state) => {
            const nuevaConfig = JSON.parse(JSON.stringify(state.configuracion)); // Clon profundo
            const categoria = nuevaConfig.elementosInspeccion.categorias.find((c: any) => c.id === categoriaId);
            if (categoria) {
                 const subelemento = categoria.subelementos.find((s: any) => s.id === subelementoId);
                 if (subelemento) {
                      // Validar nombre duplicado (ignorando el subelemento actual)
                      if (categoria.subelementos.some((s: any) => s.id !== subelementoId && s.nombre === nombre)) {
                           console.warn(`Ya existe otro subelemento con el nombre "${nombre}" en esta categoría.`);
                           return { configuracion: state.configuracion }; // No modificar
                       }
                      subelemento.nombre = nombre;
                      state.setConfiguracion(nuevaConfig); // Guardar
                  }
             }
             return { configuracion: nuevaConfig };
        });
   },
   eliminarSubelemento: (categoriaId, subelementoId) => {
        set((state) => {
             const nuevaConfig = JSON.parse(JSON.stringify(state.configuracion)); // Clon profundo
             const categoria = nuevaConfig.elementosInspeccion.categorias.find((c: any) => c.id === categoriaId);
             if (categoria) {
                 categoria.subelementos = categoria.subelementos.filter((s: any) => s.id !== subelementoId);
                 state.setConfiguracion(nuevaConfig); // Guardar
             }
             return { configuracion: nuevaConfig };
        });
   },
   toggleSubelemento: (categoriaId, subelementoId) => {
       set((state) => {
            const nuevaConfig = JSON.parse(JSON.stringify(state.configuracion)); // Clon profundo
            const categoria = nuevaConfig.elementosInspeccion.categorias.find((c: any) => c.id === categoriaId);
            if (categoria) {
                 const subelemento = categoria.subelementos.find((s: any) => s.id === subelementoId);
                 if (subelemento) {
                     subelemento.activo = !subelemento.activo;
                     state.setConfiguracion(nuevaConfig); // Guardar
                 }
             }
             return { configuracion: nuevaConfig };
        });
   },
   crearNuevoInformeCaptura: (informe) => {
        set((state) => {
            const actuales = [...state.informesCapturaRapida, informe];
            localStorage.setItem('informesCapturaRapida', JSON.stringify(actuales));
            localStorage.setItem('informeCapturaActivoId', informe.id);
            return { informesCapturaRapida: actuales, informeCapturaActivoId: informe.id };
        });
   },
   guardarItemEnInformeActivo: (item) => {
        set((state) => {
            if (!state.informeCapturaActivoId) return {};
            const actuales = JSON.parse(JSON.stringify(state.informesCapturaRapida)); // Clon profundo
            const informe = actuales.find((i: InformeCaptura) => i.id === state.informeCapturaActivoId);
            if (!informe) return {};
            informe.items.push(item);
            localStorage.setItem('informesCapturaRapida', JSON.stringify(actuales));
            return { informesCapturaRapida: actuales };
        });
   },
   guardarInformeCaptura: (informe) => {
        set((state) => {
            const actuales = state.informesCapturaRapida.map(i =>
                i.id === informe.id ? informe : i
            );
            localStorage.setItem('informesCapturaRapida', JSON.stringify(actuales));
            return { informesCapturaRapida: actuales };
        });
   },
   activarInformeExistente: (id) => {
        localStorage.setItem('informeCapturaActivoId', id);
        set({ informeCapturaActivoId: id });
   },
   eliminarInformeCaptura: (id) => {
        set((state) => {
            const actuales = state.informesCapturaRapida.filter(i => i.id !== id);
            localStorage.setItem('informesCapturaRapida', JSON.stringify(actuales));
            let nuevoActivoId = state.informeCapturaActivoId;
            if (state.informeCapturaActivoId === id) {
                 localStorage.removeItem('informeCapturaActivoId');
                 nuevoActivoId = null;
            }
            return { informesCapturaRapida: actuales, informeCapturaActivoId: nuevoActivoId };
        });
   },
    moverItemArriba: (informeId, idx) => {
        set((state) => {
            if (idx === 0) return {};
            const actuales = JSON.parse(JSON.stringify(state.informesCapturaRapida));
            const informe = actuales.find((i: InformeCaptura) => i.id === informeId);
            if (!informe || idx >= informe.items.length) return {};
            [informe.items[idx - 1], informe.items[idx]] = [informe.items[idx], informe.items[idx - 1]];
            localStorage.setItem('informesCapturaRapida', JSON.stringify(actuales));
            return { informesCapturaRapida: actuales };
        });
   },
   moverItemAbajo: (informeId, idx) => {
        set((state) => {
            const actuales = JSON.parse(JSON.stringify(state.informesCapturaRapida));
            const informe = actuales.find((i: InformeCaptura) => i.id === informeId);
            if (!informe || idx < 0 || idx >= informe.items.length - 1) return {};
             [informe.items[idx], informe.items[idx + 1]] = [informe.items[idx + 1], informe.items[idx]];
             localStorage.setItem('informesCapturaRapida', JSON.stringify(actuales));
             return { informesCapturaRapida: actuales };
        });
   },
   clonarItem: (informeId, idx) => {
       set((state) => {
            const actuales = JSON.parse(JSON.stringify(state.informesCapturaRapida));
            const informe = actuales.find((i: InformeCaptura) => i.id === informeId);
            if (!informe || idx < 0 || idx >= informe.items.length) return {};
            const itemClonado = JSON.parse(JSON.stringify(informe.items[idx])); // Clon profundo del item
            informe.items.splice(idx + 1, 0, itemClonado); // Insertar clon después del original
            localStorage.setItem('informesCapturaRapida', JSON.stringify(actuales));
            return { informesCapturaRapida: actuales };
        });
   },
   eliminarItem: (informeId, idx) => {
       set((state) => {
            const actuales = JSON.parse(JSON.stringify(state.informesCapturaRapida));
            const informe = actuales.find((i: InformeCaptura) => i.id === informeId);
            if (!informe || idx < 0 || idx >= informe.items.length) return {};
            informe.items.splice(idx, 1); // Eliminar el item en el índice dado
            localStorage.setItem('informesCapturaRapida', JSON.stringify(actuales));
            return { informesCapturaRapida: actuales };
        });
   },
   createCheckpoint: () => {
        set((state) => {
             // Crear clon profundo para el checkpoint
             const checkpointData = {
                 informesPorAmbiente: JSON.parse(JSON.stringify(state.informesPorAmbiente)),
                 informesCapturaRapida: JSON.parse(JSON.stringify(state.informesCapturaRapida))
             };
             const checkpoint: Checkpoint = {
                 timestamp: Date.now(),
                 ...checkpointData
             };
             const checkpoints = [...state.checkpoints, checkpoint];
             localStorage.setItem('checkpoints', JSON.stringify(checkpoints));
             return { checkpoints };
        });
   },
   rollbackToCheckpoint: (timestamp) => {
       const state = get();
       const checkpoint = state.checkpoints.find(cp => cp.timestamp === timestamp);
       if (!checkpoint) {
           console.warn(`Checkpoint with timestamp ${timestamp} not found.`);
           return;
       }

       // Crear copias profundas antes de actualizar el estado
       const rolledBackInformesPorAmbiente = JSON.parse(JSON.stringify(checkpoint.informesPorAmbiente));
       const rolledBackInformesCaptura = JSON.parse(JSON.stringify(checkpoint.informesCapturaRapida));

       // Actualizar localStorage para cada draft individualmente
       Object.keys(state.informesPorAmbiente).forEach(amb => {
           // Eliminar drafts que no existen en el checkpoint
           if (!rolledBackInformesPorAmbiente[amb]) {
               localStorage.removeItem(`draft_${amb}`);
           }
       });
       Object.entries(rolledBackInformesPorAmbiente).forEach(([amb, data]) => {
           localStorage.setItem(`draft_${amb}`, JSON.stringify(data));
       });
       localStorage.setItem('informesCapturaRapida', JSON.stringify(rolledBackInformesCaptura));

       // Actualizar estado de Zustand
       set({
           informesPorAmbiente: rolledBackInformesPorAmbiente,
           informesCapturaRapida: rolledBackInformesCaptura,
           // Podría ser necesario re-evaluar ambientesActivos o ambienteSeleccionado
           ambientesActivos: Object.keys(rolledBackInformesPorAmbiente), // O una lógica más compleja
           ambienteSeleccionado: state.ambienteSeleccionado && rolledBackInformesPorAmbiente[state.ambienteSeleccionado]
               ? state.ambienteSeleccionado
               : (Object.keys(rolledBackInformesPorAmbiente)[0] || ''), // Seleccionar el primero o ninguno
        });
   },
   deleteCheckpoint: (timestamp) => {
       set((state) => {
           const checkpoints = state.checkpoints.filter(cp => cp.timestamp !== timestamp);
           localStorage.setItem('checkpoints', JSON.stringify(checkpoints));
           return { checkpoints };
       });
   },
    crearNuevoInformeElementos: (informe) => {
        set((state) => {
            const actuales = [...state.informesElementos, informe];
            localStorage.setItem('informesElementos', JSON.stringify(actuales));
            localStorage.setItem('informeElementosActivoId', informe.id);
            return { informesElementos: actuales, informeElementosActivoId: informe.id };
        });
   },
   guardarInformeElementos: (informe) => {
        set((state) => {
            const actuales = state.informesElementos.map(i =>
                i.id === informe.id ? informe : i
            );
            localStorage.setItem('informesElementos', JSON.stringify(actuales));
            return { informesElementos: actuales };
        });
   },
   activarInformeElementos: (id) => {
        localStorage.setItem('informeElementosActivoId', id);
        set({ informeElementosActivoId: id });
   },
   eliminarInformeElementos: (id) => {
        set((state) => {
            const actuales = state.informesElementos.filter(i => i.id !== id);
            localStorage.setItem('informesElementos', JSON.stringify(actuales));
            let nuevoActivoId = state.informeElementosActivoId;
            if (state.informeElementosActivoId === id) {
                localStorage.removeItem('informeElementosActivoId');
                nuevoActivoId = null;
            }
            return { informesElementos: actuales, informeElementosActivoId: nuevoActivoId };
        });
   },
   guardarItemEnInformeElementosActivo: (item) => {
       set((state) => {
           if (!state.informeElementosActivoId) return {};
           const actuales = JSON.parse(JSON.stringify(state.informesElementos)); // Clon profundo
           const informe = actuales.find((i: ElementosInforme) => i.id === state.informeElementosActivoId);
           if (!informe) return {};
           informe.items.push(item);
           localStorage.setItem('informesElementos', JSON.stringify(actuales));
           return { informesElementos: actuales };
       });
   },


}));

// --- Inicialización Opcional ---
// Cargar configuración desde localStorage al iniciar la app
try {
    const savedConfig = localStorage.getItem('configuracionApp');
    if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        // Podrías hacer un merge o validación aquí antes de llamar a setConfiguracion
        useDataStore.getState().setConfiguracion(parsedConfig);
    }
} catch (error) {
    console.error("Error loading initial configuration from localStorage:", error);
}

// Podrías cargar también informesPorAmbiente iniciales aquí si no se maneja en otro lugar


export default useDataStore;
