class DB {
    static USER : string = process.env.USER_DB || 'postgres'
    static PASSWORD  = process.env.PASSWORD_DB || 'postgres'
    static DATABASE = process.env.DATABASE || 'blog'
    static PORT =  process.env.PORT_DB ? Number(process.env.PORT) : 5432
    static HOST = process.env.HOST_DB || 'localhost'
    static DIALECT = process.env.DIALECT_DB || 'postgres'
}

class APP{
    static PRIVATE_KEY : string = process.env.PRIVATE_KEY || 'DEF'
}

export{ DB , APP} ;