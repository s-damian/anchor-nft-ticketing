mod kernel;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::Metadata,
    token::{Mint, Token, TokenAccount},
};
use kernel::event_manager::EventManager;
use kernel::nft_manager::NftManager;
use kernel::ticket_manager::TicketManager;
use mpl_token_metadata::accounts::{MasterEdition, Metadata as MetadataAccount};

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
        EventManager::run_create_event(ctx, title, description, date, location, ticket_price)
    }

    // Instruction permettant de créer un ticket pour un événement.
    pub fn buy_ticket(ctx: Context<BuyTicket>, date_of_purchase: i64) -> Result<()> {
        TicketManager::run_buy_ticket(ctx, date_of_purchase)
    }

    // Déclare la fonction create_nft et appelle la fonction externalisée
    pub fn create_nft(
        ctx: Context<CreateNft>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        NftManager::run_create_nft(ctx, name, symbol, uri)
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
    pub organizer: AccountInfo<'info>, // Ajouté spécialement afin de pouvoir effectuer le transfert des lamports.
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateNft<'info> {
    // CHECK: ok, nous passons ce compte nous-mêmes
    #[account(mut, signer)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        mint::decimals = 0,
        mint::authority = signer.key(),
        mint::freeze_authority = signer.key(),
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer
    )]
    pub associated_token_account: Account<'info, TokenAccount>,
    // CHECK - address
    #[account(
        mut,
        address = MetadataAccount::find_pda(&mint.key()).0,
    )]
    pub metadata_account: AccountInfo<'info>,
    // CHECK: address
    #[account(
        mut,
        address = MasterEdition::find_pda(&mint.key()).0,
    )]
    pub master_edition_account: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
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
pub enum CustomError {
    #[msg("L'organisateur fourni ne correspond pas à l'organisateur de l'événement.")]
    InvalidOrganizer,
}
