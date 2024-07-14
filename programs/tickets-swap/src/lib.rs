use anchor_lang::prelude::*;

declare_id!("9Pjw3S522y2xavPFvmZ1pSHU8akopTzXCdCY3iY9eRAA");

#[program]
pub mod tickets_swap {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn create_event(
        ctx: Context<CreateEvent>,
        title: String,
        description: String,
        date: i64,
        location: String,
    ) -> Result<()> {
        let event = &mut ctx.accounts.event;
        event.title = title;
        event.description = description;
        event.date = date;
        event.location = location;
        event.organizer = *ctx.accounts.organizer.key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

// Instruction permettant de créer un événement.
#[derive(Accounts)]
pub struct CreateEvent<'info> {
    #[account(init, payer = organizer, space = 8 + 32 + 4 + 100 + 4 + 256 + 8 + 4 + 100)]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Structure pour stocker les informations de l'événement.
#[account]
pub struct Event {
    pub title: String,
    pub description: String,
    pub date: i64,
    pub location: String,
    pub organizer: Pubkey,
}
