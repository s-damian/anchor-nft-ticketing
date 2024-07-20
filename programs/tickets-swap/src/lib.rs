use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_master_edition_v3, create_metadata_accounts_v3, CreateMasterEditionV3,
        CreateMetadataAccountsV3, Metadata,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};
use mpl_token_metadata::accounts::{MasterEdition, Metadata as MetadataAccount};
use mpl_token_metadata::types::DataV2;

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

    // Instruction permettant de créer un ticket pour un événement.
    pub fn buy_ticket(ctx: Context<BuyTicket>, date_of_purchase: i64) -> Result<()> {
        let ticket = &mut ctx.accounts.ticket;
        let event = &ctx.accounts.event;

        // Sécurité importante : vérifier que l'organisateur fourni (depuis le Front-End) correspond à l'organisateur de l'événement.
        if ctx.accounts.organizer.key() != event.organizer {
            return Err(MyError::InvalidOrganizer.into());
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

    pub fn init_nft(
        ctx: Context<InitNFT>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        // Initialiser le NFT
        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.associated_token_account.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            },
        );

        mint_to(cpi_context, 1)?;

        // Créer le compte de metadata
        let cpi_context = CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.owner.to_account_info(),
                update_authority: ctx.accounts.owner.to_account_info(),
                payer: ctx.accounts.owner.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        );

        let data_v2 = DataV2 {
            name,
            symbol,
            uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        create_metadata_accounts_v3(cpi_context, data_v2, true, true, None)?;

        // Créer le compte de master edition
        let cpi_context = CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMasterEditionV3 {
                edition: ctx.accounts.master_edition_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                update_authority: ctx.accounts.owner.to_account_info(),
                mint_authority: ctx.accounts.owner.to_account_info(),
                payer: ctx.accounts.owner.to_account_info(),
                metadata: ctx.accounts.metadata_account.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        );

        create_master_edition_v3(cpi_context, None)?;

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
    pub organizer: AccountInfo<'info>, // Ajouté spécialement afin de pouvoir effectuer le transfert des lamports.
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitNFT<'info> {
    /// CHECK: ok, we are passing in this account ourselves
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,
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
    /// CHECK - address
    #[account(
        mut,
        address = MetadataAccount::find_pda(&mint.key()).0,
    )]
    pub metadata_account: AccountInfo<'info>,
    /// CHECK: address
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
pub enum MyError {
    #[msg("L'organisateur fourni ne correspond pas à l'organisateur de l'événement.")]
    InvalidOrganizer,
}
