class TicketRepository{
    constructor(dao){
        this.dao=dao
    }
    getTicket=async tid => await this.dao.get(tid)
    getTickets= async (email,status)=>await this.dao.getAll(email,status)
    createTicket= async data => await this.dao.create(data)
    deleteTicket= async tid =>await this.dao.delete(tid)
}
module.exports=TicketRepository