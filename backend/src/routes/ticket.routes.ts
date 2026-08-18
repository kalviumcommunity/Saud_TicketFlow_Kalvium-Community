import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authenticate } from '../middleware/authenticate';
import { isAgent } from '../middleware/isAgent';
import {
  validateTicketQuery,
  validateTicketPatch,
  validateReplyInput,
} from '../middleware/validate';

const router = Router();

// Protect all ticket routes with authentication & agent/admin role middleware
router.use(authenticate, isAgent);

router.get('/', validateTicketQuery, TicketController.getTickets);
router.get('/:id', TicketController.getTicketById);
router.patch('/:id', validateTicketPatch, TicketController.updateTicket);

router.get('/:id/replies', TicketController.getReplies);
router.post('/:id/replies', validateReplyInput, TicketController.createReply);

export default router;
