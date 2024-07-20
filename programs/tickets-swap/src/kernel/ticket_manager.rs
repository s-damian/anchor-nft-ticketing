use crate::BuyTicket;
use crate::CustomError;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

pub struct TicketManager {}

impl TicketManager {
    pub fn run_buy_ticket(ctx: Context<BuyTicket>, date_of_purchase: i64) -> Result<()> {
        let ticket = &mut ctx.accounts.ticket;
        let event = &ctx.accounts.event;

        // Sécurité importante : vérifier que l'organisateur fourni (depuis le Front-End) correspond à l'organisateur de l'événement.
        if ctx.accounts.organizer.key() != event.organizer {
            return Err(CustomError::InvalidOrganizer.into());
        }

        ticket.event = event.key();
        ticket.price = event.ticket_price; // Assigner au ticket le prix actuel du billet de l'événement.
        ticket.date_of_purchase = date_of_purchase; // Date de quand le owner a acheté ce ticket.
        ticket.owner = *ctx.accounts.owner.key; // Définit l'acheteur du ticket.

        let lamports = ticket.price;

        // Logger les informations avant le transfert.
        msg!("Buying ticket:");
        msg!("Owner: {}", ctx.accounts.owner.key());
        msg!("Event: {}", event.key());
        msg!("Organizer: {}", event.organizer);
        msg!("Lamports: {}", lamports);

        // Transférer SOL de l'acheteur à l'organisateur.
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.owner.key(),
                &event.organizer, // Ceci marche aussi : event.organizer.key()
                lamports,
            ),
            &[
                ctx.accounts.owner.to_account_info(),
                ctx.accounts.organizer.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        msg!("Success.");

        Ok(())
    }
}
