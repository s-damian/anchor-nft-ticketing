use anchor_lang::prelude::*;

// Déclare l'ID du programme
declare_id!("9Pjw3S522y2xavPFvmZ1pSHU8akopTzXCdCY3iY9eRAA");

#[program]
pub mod tickets_swap {
    use super::*;

    // Instruction d'initialisation du programme
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id); // Affiche un message de salutation avec l'ID du programme
        Ok(())
    }

    // Instruction permettant de créer un événement
    pub fn create_event(
        ctx: Context<CreateEvent>,
        title: String,
        description: String,
        date: i64,
        location: String,
    ) -> Result<()> {
        let event = &mut ctx.accounts.event; // Accède au compte de l'événement
        event.title = title;
        event.description = description;
        event.date = date;
        event.location = location;
        event.organizer = *ctx.accounts.organizer.key; // Définit l'organisateur de l'événement
        Ok(())
    }

    // Instruction permettant de récupérer un événement
    pub fn get_event(ctx: Context<GetEvent>) -> Result<Event> {
        let event_account = &ctx.accounts.event;
        let event = Event {
            title: event_account.title.clone(),
            description: event_account.description.clone(),
            date: event_account.date,
            location: event_account.location.clone(),
            organizer: event_account.organizer,
        };
        Ok(event)
    }
}

// Contexte de l'instruction d'initialisation
#[derive(Accounts)]
pub struct Initialize {}

// Contexte de l'instruction permettant de créer un événement
#[derive(Accounts)]
pub struct CreateEvent<'info> {
    // Initialise le compte de l'événement, en spécifiant le payeur et l'espace nécessaire
    #[account(init, payer = organizer, space = 8 + 32 + 4 + 100 + 4 + 256 + 8 + 4 + 100)]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub organizer: Signer<'info>, // Organisateur de l'événement, qui doit être un signataire de la transaction
    pub system_program: Program<'info, System>, // Programme système Solana
}

// Contexte de l'instruction permettant de récupérer un événement
#[derive(Accounts)]
pub struct GetEvent<'info> {
    pub event: Account<'info, Event>,
}

// Structure pour stocker les informations de l'événement
#[account]
pub struct Event {
    pub title: String,
    pub description: String,
    pub date: i64,
    pub location: String,
    pub organizer: Pubkey, // Clé publique de l'organisateur de l'événement
}
