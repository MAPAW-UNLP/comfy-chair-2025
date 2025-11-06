# Aspectos del Front Desarrollados por el Grupo 1

    El grupo 1 se encargó de la lectura, alta, baja y modificación de articulos. 

# ---------- Components ----------

    ArticleCard - (src/components/article/ArticleCard.tsx)
        * Props: objeto del tipo article.
        * Data: titulo, tipo, sesion, conferencia, estado y deadline de un articulo.
        * Acciones: ver detalle, editar (si permite), descargar archivo principal, descargar archivo fuentes (si tiene), eliminar (si permite).
        
    ArticleDetail - (src/components/article/ArticleDetail.tsx)
        * Props: objeto del tipo article.
        * Data: todos los atributos de un articulo.
        * Acciones: ver archivo principal, ver archivo fuentes (si tiene), volver al menu de articulos.

    ArticleForm - (src/components/article/ArticleForm.tsx)
        * Props: listado de conferencias, listado de usuarios, flag de edición (modo alta o edición), articulo (para modo edición).
        * Data: todos los atributos de un articulo a crear o editar (en edición no se puede cambiar la conferencia).
        * Acciones: subir articulo (modo alta), editar articulo(modo edición), volver al menu de articulos (modo edición).

    ConferenceCombobox - (src/components/combobox/ConferenceCombobox.tsx)
        * Props: listado de conferencias, valor actual, flag de disabled (para modo edición del form), metodo onValueChange.
        * Data: titulo de cada conferencia.
        * Acciones: buscar y seleccionar conferencias.

    UserCombobox - (src/components/combobox/UserCombobox.tsx)
        * Props: listado de usuarios, metodo onValueChange.
        * Data: nombre completo y correo de cada usuario.
        * Acciones: buscar y seleccionar usuarios.

# ---------- Routes ----------

    article/detail/$articleId.tsx - (src/routes/article/detail/articleId.tsx)
        * Hace uso del componente "ArticleDetail"
        * Muestra un mensaje si no encuentra un articulo con el id indicado

    article/edit/$articleId.tsx - (src/routes/article/edit/articleId.tsx)
        * Hace uso del componente "ArticleForm"
        * Muestra un mensaje si no encuentra un articulo con el id indicado
        * Bloquea la edición si ya pasó la deadline de la sesión del articulo
        
    article/create - (src/routes/article/create.tsx)
        * Hace uso del componente "ArticleForm"

    articles/$conferenceId - (src/routes/articles/conferenceId.tsx)
        * Hace uso del componente "ArticleCard"
        * Muestra un mensaje si no encuentra una conferencia con el id indicado
        * Permite volver al menú anterior (articles/test provisoriamente, luego será el dashboard de inicio)
        * Muestra el titulo de la conferencia seleccionada
        * Muestra todos los articulos de la conferencia seleccionada

    articles/test - (src/routes/articles/test.tsx)
        * Componente provisorio que simula ser el dashboard del grupo 5
        * Muestra todas las conferencias activas en forma de botones
        * Permite entrar a ver los articulos de una conferencia al clickear una

# ---------- Services ----------

    articleServices - (src/services/articleServices.ts)
        * metodo "createArticle()"
        * metodo "updateArticle()"
        * metodo "getArticleById()"
        * metodo "getArticlesByConferenceId()"

    conferenceServices - (src/services/conferenceServices.ts) - Desarrollado por otro grupo, solo se usaron o crearon los metodos necesarios.
        * metodo "getActiveConferences()"
        * metodo "getConferenceById()"

    sessionServices - (src/services/sessionServices.ts) - Desarrollado por otro grupo, solo se usaron o crearon los metodos necesarios.
        * metodo "getSessionsByConferenceGrupo1()"

    userServices - (src/services/userServices.ts) - Desarrollado por otro grupo, solo se usaron o crearon los metodos necesarios.
        * metodo "getAllUsers()"
    