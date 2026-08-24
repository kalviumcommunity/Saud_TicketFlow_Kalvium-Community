import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authenticate } from '../middleware/authenticate';
import { isAgent } from '../middleware/isAgent';
import {
  validateCreateTicket,
  validateTicketQuery,
  validateTicketPatch,
  validateReplyInput,
  validateAttachmentInput,
} from '../middleware/validate';

const router = Router();

// Protect all ticket routes with authentication & agent/admin role middleware
router.use(authenticate, isAgent);

router.post('/', validateCreateTicket, TicketController.createTicket);
router.get('/', validateTicketQuery, TicketController.getTickets);
router.get('/:id', TicketController.getTicketById);
router.patch('/:id', validateTicketPatch, TicketController.updateTicket);
router.delete('/:id', TicketController.deleteTicket);

router.get('/:id/replies', TicketController.getReplies);
router.post('/:id/replies', validateReplyInput, TicketController.createReply);

router.post('/:id/attachments', validateAttachmentInput, TicketController.uploadAttachment);

export default router;
