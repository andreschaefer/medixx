<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template match="/">
		<html>
			<body>
				<h1>Fritzchens Pillenverwaltung 4.0</h1>
				<div id="date">
					Letzte Aktualisierung:
					<xsl:value-of select="pillen/Datum/@Tag" />.<xsl:value-of select="pillen/Datum/@Monat" />.<xsl:value-of select="pillen/Datum/@Jahr" />
				</div>
				<table border="1">
					<tr>
						<th>Name</th>
						<th>Verbrauch</th>
						<th>Vorrat</th>
					</tr>
					<xsl:for-each select="pillen/Sorte">
						<tr>
							<td>
								<xsl:value-of select="@Name" />
							</td>
							<td>
								<xsl:value-of select="@Verbrauch" />
							</td>
							<td>
								<xsl:value-of select="@Vorrat" />
							</td>
						</tr>
					</xsl:for-each>
				</table>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet>