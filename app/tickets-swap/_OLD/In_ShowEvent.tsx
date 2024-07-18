const handleSubmitBuyTicket_OLD = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet?.publicKey) {
        alert("Veuillez connecter votre portefeuille !");
        return;
    }

    if (!eventPublicKey) {
        return;
    }

    const { program, SystemProgram } = getAnchorProgram(wallet);
    const ticketAccount = web3.Keypair.generate();
    const dateOfPurchase = new BN(new Date().getTime() / 1000); // Convertir la date en secondes puis en BN (BigNumber)

    try {
        const tx = await program.methods
            .buyTicket(dateOfPurchase)
            .accounts({
                ticket: ticketAccount.publicKey,
                event: new web3.PublicKey(eventPublicKey),
                owner: wallet.publicKey,
                organizer: eventDetails.organizer,
                systemProgram: SystemProgram.programId,
            })
            .signers([ticketAccount])
            .transaction();

        // Add transfer of SOL to the transaction
        const transaction = new web3.Transaction().add(
            tx,
            web3.SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: eventDetails.organizer,
                lamports: eventDetails.ticketPrice,
            }),
        );

        // Send the transaction
        const txid = await wallet.sendTransaction(transaction, program.provider.connection);
        console.log("Success to buy ticket");
        console.log("txid", txid);
        console.log("ticketAccount.publicKey.toBase58()", ticketAccount.publicKey.toBase58());

        // Récupère les tickets après la création d'un nouveau ticket
        const accounts = await program.account.ticket.all([
            {
                memcmp: {
                    offset: 8,
                    bytes: eventPublicKey,
                },
            },
        ]);

        setTickets(accounts.map(({ publicKey, account }) => ({ publicKey, account })));
    } catch (err) {
        console.error("Failed to buy ticket.", err);
    }
};
