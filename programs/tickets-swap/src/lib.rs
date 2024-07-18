use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

// Déclare l'ID du programme.
declare_id!("FDpDx1vfXUn9FNPWip6VVr2HrUC5Mq6Lb6P73rQPtQMa");

#[program]
pub mod tickets_swap {
    use super::*;

    // Instruction permettant de créer un événement.
    pub fn create_event(
        ctx: Context<CreateEvent>,
        title: String,
        description: String,
        date: i64,
        location: String,
        ticket_price: u64,
    ) -> Result<()> {
        let event = &mut ctx.accounts.event; // Accède au compte de l'événement.

        event.title = title;
        event.description = description;
        event.date = date;
        event.location = location;
        event.organizer = *ctx.accounts.organizer.key; // Définit l'organisateur de l'événement.
        event.ticket_price = ticket_price; // Assigner en lamports.

        Ok(())
    }

    // Instruction permettant de créer un ticker pour un X événement.
    pub fn buy_ticket(ctx: Context<BuyTicket>, date_of_purchase: i64) -> Result<()> {
        let ticket = &mut ctx.accounts.ticket;
        let event = &ctx.accounts.event;

        // Sécurité importane : vérifier que l'organisateur fourni (depuis le Front-End) correspond à l'organisateur de l'événement.
        if ctx.accounts.organizer.key() != event.organizer {
            return Err(MyError::InvalidOrganizer.into());
        }

        ticket.event = event.key();
        ticket.price = event.ticket_price; // Assigner au ticker le prix actuel du billet de l'événement.
        ticket.date_of_purchase = date_of_purchase; // Prix de quand le owner a acheté ce ticket.
        ticket.owner = *ctx.accounts.owner.key; // Définit l'acheteur du ticket.

        //Transférer SOL de l'acheteur à l'organisateur.
        let lamports = ticket.price; // En supposant que ticket.price soit déjà dans les lamports.

        // Logger les informations avant le transfert.
        msg!("Buying ticket:");
        msg!("Owner: {}", ctx.accounts.owner.key());
        msg!("Event: {}", event.key());
        msg!("Organizer: {}", event.organizer);

        invoke(
            &system_instruction::transfer(
                &ctx.accounts.owner.key(),
                &event.organizer, // PS : ceci aussi marche : event.organizer.key()
                lamports,
            ),
            &[
                ctx.accounts.owner.to_account_info(),
                ctx.accounts.organizer.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        Ok(())
    }
}

// Contexte de l'instruction permettant de créer un événement.
#[derive(Accounts)]
pub struct CreateEvent<'info> {
    // Initialise le compte de l'événement, en spécifiant le payeur et l'espace nécessaire.
    #[account(init, payer = organizer, space = 8 + 32 + 4 + 100 + 4 + 256 + 8 + 4 + 100 + 8)]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Contexte de l'instruction permettant de créer un ticker pour un X événement.
#[derive(Accounts)]
pub struct BuyTicket<'info> {
    // Initialise le compte du ticket, en spécifiant le payeur et l'espace nécessaire.
    #[account(init, payer = owner, space = 8 + 32 + 32 + 8 + 8)]
    pub ticket: Account<'info, Ticket>,
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub organizer: AccountInfo<'info>, // Ajouté spécialement afin de pouvoir effectuer le transfert les lamports.
    pub system_program: Program<'info, System>,
}

// Structure pour stocker les informations de l'événement.
#[account]
pub struct Event {
    pub title: String,
    pub description: String,
    pub date: i64,
    pub location: String,
    pub ticket_price: u64,
    pub organizer: Pubkey, // Clé publique de l'organisateur de l'événement.
}

#[account]
pub struct Ticket {
    pub event: Pubkey,
    pub price: u64,
    pub date_of_purchase: i64,
    pub owner: Pubkey,
}

#[error_code]
pub enum MyError {
    #[msg("L'organisateur fourni ne correspond pas à l'organisateur de l'événement.")]
    InvalidOrganizer,
}
