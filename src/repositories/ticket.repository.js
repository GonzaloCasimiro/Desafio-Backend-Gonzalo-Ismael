class TicketRepository{
    constuctor(dao){
        this.dao=dao
    }
    getTicket=async tid => await this.dao.get(tid)
    getTickets= async ()=>await this.dao.getAll()
    createTicket=async data => await this.dao.create(data)
    deleteTicket=async tid =>await this.dao.delete(tid)
}
module.exports=TicketRepository