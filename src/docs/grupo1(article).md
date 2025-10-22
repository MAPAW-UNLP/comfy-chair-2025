### Aspectos del Front Desarrollados por el Grupo 1

El grupo 1 se encargó del alta de articulos y la posibilidad de editar los mismos antes del deadline de la sesión a la que corresponden.

1) Routes

# /article/view (src/routes/article/view.tsx)

Esta ruta hace uso del componente [ArticleCard]: carga todos los articulos de la base de datos (cuando esté implementado el login debería traer solo los articulos propios del usuario autenticado) y mapea cada uno a un componente tipo "card".

# /article/create (src/routes/article/create.tsx)

Esta ruta hace uso del componente [ArticleForm]: carga todas las conferencias y todos los usuarios de la base de datos (cuando estén implementados los roles debería traer solo los usuarios autores) para enviarselos al componente form, de esta forma el componente posee todo lo que necesita para dar de alta un articulo.

# /article/edit/id (src/routes/article/edit/$id.tsx)

Esta ruta posee un componente de prueba actualmente ya que está programada para el segundo sprint. Debería reutilizar el componente [ArticleForm], cargando la informacion del articulo a editar y permitir poder guardar los cambios o cancelar y volver atrás.

2) Components

# ArticleCard (src/components/article/ArticleCard.tsx)

Este componente muestra un articulo en forma de "card", resaltando el titulo, sesion y conferencia del mismo. Además posee una serie de botones interactivos:

Boton "Estado": tiene 3 colores distintos. Rojo (slate-900) cuando el estado del articulo es "Rechazado", verde (lime-900) cuando es "Aceptado" y azul (slate-900) para el resto de los estados. Al clickear el boton se abre un modal con una descripcion del estado correspondiente para que el usuario entienda con detalle que significa cada estado del articulo.

Boton "Modificar": si la fecha actual es anterior a la deadline de la sesión, entonces el boton se ve de color azul (slate-900) y permite abrir un modal que muestra la fecha y hora de la deadline de la sesion para que el usuario pueda saber hasta cuando tiene tiempo de modificar el articulo. El texto del boton muestra la cantidad de tiempo restante en dias, horas o minutos segun corresponda.
Si la fecha actual es posterior a la deadline de la sesión, entonces el boton se ve de color gris (zinc-500) y se encuentra deshabilitado (no clickeable) con la leyenda "No Disponible"

Icono "Ver": utiliza el componente [ArticleDetail]. Permite abrir un modal que muestra la información detallada de un articulo. 

Icono "Editar": navega hacia la ruta /article/edit/id. Correspondiendo id al articulo del cual se clickea para poder permitir editar el mismo. Este icono solo se visualiza cuando el articulo se puede editar (antes de la deadline de la sesión)

# ArticleForm (src/components/article/ArticleForm.tsx)

Este componente muestra un formulario con todos los campos requeridos para el alta de un articulo. El form hace uso de los componentes [ConferenceCombobox] y [UserCombobox] para poder mostrar y permitir seleccionar las conferencias (cada conferencia trae sus sesiones también) y usuarios autores. Todos los campos del formulario son obligatorios, en caso de tratarse de un articulo tipo "poster" se agrega un campo extra para subir el archivo con las fuentes. El resto de campos son iguales para ambos tipos de articulos.
Todos los campos poseen validaciones null y los campos de archivos (articulo y fuentes) validan que el archivo seleccionado no sea vacío.
En caso de haber un error al subir el articulo entonces se muestra un mensaje debajo del form. En caso de exito se navega a la ruta /article/view para ver el articulo cargado y también se muestra un toast de confirmación

# ArticleDetail (src/components/article/ArticleDetail.tsx)

Este componente muestra todos los campos de un articulo de forma completa y detallada. Ademas permite descargar el archivo que contiene el articulo y el archivo de fuentes en caso de ser un articulo del tipo abstract.

# ConferenceCombobox (src/components/combobox/ConferenceCombobox.tsx)

Este componente provee un input de tipo "combobox" para poder buscar y seleccionar conferencias

# UserCombobox (src/components/combobox/UserCombobox.tsx)

Este componente provee un input de tipo "combobox" para poder buscar y seleccionar usuarios

3) Services

# articleServices (src/services/articleServices.ts)

Este servicio se encarga de la comunicación entre el front y la api que maneja los articulos. Declara los tipos de articulo, los estados posibles del articulo, la interfaz para la lectura de un articulo y la interfaz para el alta de un articulo. Posee tambien 3 metodos, "getAllArticles", "createArticle" y "getArticleById" que dan servicio a los componentes del front declarados anteriormente.